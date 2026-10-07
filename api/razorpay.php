<?php
/**
 * Razorpay helpers: credentials, REST calls, amount maths and signature checks.
 *
 * The key secret lives only in api/config.php (blocked from the web by
 * api/.htaccess, never committed, never sent to the browser). Nothing in this
 * file prints, logs or returns the secret.
 */

declare(strict_types=1);

/** ['id' => key_id, 'secret' => key_secret] - empty when payments are not configured. */
function rz_keys(): array
{
    $id = trim((string) (cfg('razorpay_key_id') ?? ''));
    $secret = trim((string) (cfg('razorpay_key_secret') ?? ''));
    if ($id === '' || $secret === '' || str_starts_with($id, 'YOUR_')) {
        return [];
    }
    return ['id' => $id, 'secret' => $secret];
}

function rz_enabled(): bool
{
    return rz_keys() !== [];
}

/** Public key id - safe to send to the browser, Checkout needs it. */
function rz_key_id(): string
{
    return rz_keys()['id'] ?? '';
}

/**
 * One Razorpay REST call with HTTP Basic auth.
 * Returns the decoded body. API-level errors end the request with a clean
 * message; the secret is never included in any output.
 */
function rz_api(string $method, string $path, ?array $payload = null): array
{
    $keys = rz_keys();
    if ($keys === []) {
        fail(503, 'Online payment is not configured on the server.');
    }
    $url = 'https://api.razorpay.com/v1' . $path;
    $json = $payload === null ? null : json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    $status = 0;
    $raw = '';

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_USERPWD        => $keys['id'] . ':' . $keys['secret'],
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'Accept: application/json'],
            CURLOPT_TIMEOUT        => 20,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);
        // Local Windows PHP ships without a CA bundle; set 'curl_cainfo' in
        // config.php there. Hosting servers leave it empty and use their own.
        $ca = trim((string) (cfg('curl_cainfo') ?? ''));
        if ($ca !== '' && is_file($ca)) {
            curl_setopt($ch, CURLOPT_CAINFO, $ca);
        }
        if ($json !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        }
        $raw = (string) curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);
        if ($status === 0) {
            error_log('[smagizh-pay] transport error: ' . $err);
            fail(502, 'Could not reach the payment gateway. Please try again.');
        }
    } else {
        // Shared hosting without cURL - plain HTTPS stream instead.
        $ctx = stream_context_create([
            'http' => [
                'method'        => $method,
                'header'        => "Authorization: Basic " . base64_encode($keys['id'] . ':' . $keys['secret']) . "\r\n"
                                 . "Content-Type: application/json\r\nAccept: application/json\r\n",
                'content'       => $json ?? '',
                'timeout'       => 20,
                'ignore_errors' => true,
            ],
        ]);
        $raw = (string) @file_get_contents($url, false, $ctx);
        foreach ($http_response_header ?? [] as $line) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $line, $m)) {
                $status = (int) $m[1];
            }
        }
        if ($status === 0) {
            fail(502, 'Could not reach the payment gateway. Please try again.');
        }
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        error_log('[smagizh-pay] unexpected gateway response, HTTP ' . $status);
        fail(502, 'The payment gateway returned an unexpected response.');
    }
    if ($status >= 400) {
        $desc = (string) ($data['error']['description'] ?? 'The payment gateway rejected the request.');
        error_log('[smagizh-pay] API error ' . $status . ': ' . $desc);
        fail(502, $desc);
    }
    return $data;
}

/**
 * What a plan costs, in paise, for the chosen billing cycle.
 * Always computed on the server from the plan price in the database and the
 * discounts in Admin -> Plans, so the amount cannot be changed by the browser.
 */
function rz_plan_amount(array $plan, string $billing, array $settings): array
{
    $price = (float) ($plan['price'] ?? 0);
    $monthlyPct = (float) ($settings['monthlyDiscount'] ?? 5);
    $annualPct = (float) ($settings['annualDiscount'] ?? 20);

    if ($billing === 'annual') {
        $perMonth = round($price * (100 - $annualPct) / 100, 2);
        $months = 12;
        $total = round($perMonth * $months, 2);
    } else {
        $billing = 'monthly';
        $perMonth = round($price * (100 - $monthlyPct) / 100, 2);
        $months = 1;
        $total = $perMonth;
    }

    return [
        'billing'  => $billing,
        'months'   => $months,
        'perMonth' => $perMonth,
        'total'    => $total,
        'paise'    => (int) round($total * 100),
    ];
}

/** Razorpay Checkout signature: HMAC-SHA256 of "order_id|payment_id". */
function rz_verify_signature(string $orderId, string $paymentId, string $signature): bool
{
    $keys = rz_keys();
    if ($keys === [] || $signature === '') {
        return false;
    }
    $expected = hash_hmac('sha256', $orderId . '|' . $paymentId, $keys['secret']);
    return hash_equals($expected, $signature);
}

/** Webhook signature: HMAC-SHA256 of the raw request body. */
function rz_verify_webhook(string $rawBody, string $signature): bool
{
    $secret = trim((string) (cfg('razorpay_webhook_secret') ?? ''));
    if ($secret === '' || $signature === '') {
        return false;
    }
    return hash_equals(hash_hmac('sha256', $rawBody, $secret), $signature);
}

/** Visitor IP, stored only as a salted hash (abuse throttling). */
function rz_ip_hash(): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    return hash('sha256', $ip . '|' . (string) cfg('db_name'));
}
