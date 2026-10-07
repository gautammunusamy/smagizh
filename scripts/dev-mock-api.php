<?php
/**
 * DEVELOPMENT ONLY - never deploy this file.
 *
 * A stand-in for the PHP/MySQL API so the site can be exercised on a machine
 * with no MySQL. Content comes from api/seed.json; the payment endpoints use
 * the real api/razorpay.php code (so order creation and signature checks are
 * the genuine ones) and keep their state in a temp JSON file.
 *
 *   php -S 127.0.0.1:8000 scripts/dev-mock-api.php
 */

declare(strict_types=1);

$root = dirname(__DIR__);
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

// Static files (so php -S can also serve the built site if asked).
if (!str_starts_with($path, '/api/')) {
    return false;
}

require $root . '/api/lib.php';
require $root . '/api/razorpay.php';

$STORE = sys_get_temp_dir() . '/smagizh-mock-payments.json';
$load = static fn(): array => is_file($GLOBALS['STORE']) ? (json_decode((string) file_get_contents($GLOBALS['STORE']), true) ?: []) : [];
$save = static function (array $rows): void {
    file_put_contents($GLOBALS['STORE'], json_encode($rows, JSON_PRETTY_PRINT));
};

$seed = json_decode((string) file_get_contents($root . '/api/seed.json'), true) ?: [];
$settings = $seed['settings'] ?? [];
$plans = $seed['plans'] ?? [];
$action = (string) ($_GET['action'] ?? '');
$in = body();

$payablePlans = static function () use ($plans): array {
    $out = [];
    foreach ($plans as $p) {
        if (empty($p['active']) || !empty($p['free']) || (float) ($p['price'] ?? 0) <= 0) {
            continue;
        }
        $out[(string) $p['id']] = $p;
    }
    return $out;
};

switch (true) {
    case str_ends_with($path, '/content.php'):
        ok([
            'settings'     => $settings,
            'categories'   => $seed['categories'] ?? [],
            'services'     => $seed['services'] ?? [],
            'plans'        => $plans,
            'comparison'   => $seed['comparison'] ?? [],
            'faqs'         => $seed['faqs'] ?? [],
            'testimonials' => $seed['testimonials'] ?? [],
            'isAdmin'      => true,
        ]);

    case str_ends_with($path, '/auth.php'):
        ok(['user' => ['id' => 1, 'username' => 'smagizh', 'name' => 'Smagizh Admin (mock)']]);

    case str_ends_with($path, '/payment.php'):
        if ($action === 'plans') {
            $list = [];
            foreach ($payablePlans() as $id => $p) {
                $m = rz_plan_amount($p, 'monthly', $settings);
                $a = rz_plan_amount($p, 'annual', $settings);
                $list[] = [
                    'id' => $id,
                    'name' => $p['name'],
                    'monthly' => ['amount' => $m['total'], 'months' => 1, 'perMonth' => $m['perMonth']],
                    'annual' => ['amount' => $a['total'], 'months' => 12, 'perMonth' => $a['perMonth']],
                ];
            }
            ok(['enabled' => rz_enabled(), 'keyId' => rz_key_id(), 'currency' => 'INR', 'plans' => $list]);
        }

        if ($action === 'create') {
            $planId = str_field($in['planId'] ?? '', 64);
            $billing = ($in['billing'] ?? '') === 'annual' ? 'annual' : 'monthly';
            $name = str_field($in['name'] ?? '', 190);
            $email = str_field($in['email'] ?? '', 190);
            $contact = digits($in['contact'] ?? '');
            if ($name === '') fail(422, 'Please enter your name.');
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail(422, 'Please enter a valid email address.');
            if (strlen($contact) < 10) fail(422, 'Please enter a valid 10-digit mobile number.');
            $all = $payablePlans();
            if (!isset($all[$planId])) fail(404, 'That plan is not available for online payment.');
            $plan = $all[$planId];
            $amount = rz_plan_amount($plan, $billing, $settings);
            $ref = 'PAY-' . date('Y') . '-' . random_int(100000, 999999);
            $order = rz_api('POST', '/orders', [
                'amount' => $amount['paise'],
                'currency' => 'INR',
                'receipt' => $ref,
                'payment_capture' => 1,
                'notes' => ['reference' => $ref, 'plan' => $plan['name'], 'billing' => $amount['billing'], 'dev' => 'local mock'],
            ]);
            $rows = $load();
            $rows[] = [
                'id' => $ref, 'planId' => $planId, 'planName' => $plan['name'], 'billing' => $amount['billing'],
                'months' => $amount['months'], 'amount' => $amount['total'], 'currency' => 'INR', 'status' => 'created',
                'orderId' => $order['id'], 'paymentId' => '', 'method' => '', 'name' => $name, 'email' => $email,
                'contact' => $contact, 'business' => str_field($in['business'] ?? '', 190), 'notes' => '',
                'createdAt' => date('Y-m-d H:i:s'), 'paidAt' => null,
            ];
            $save($rows);
            ok([
                'reference' => $ref, 'orderId' => $order['id'], 'amount' => $amount['paise'], 'display' => $amount['total'],
                'currency' => 'INR', 'months' => $amount['months'], 'billing' => $amount['billing'],
                'planName' => $plan['name'], 'keyId' => rz_key_id(),
                'prefill' => ['name' => $name, 'email' => $email, 'contact' => $contact],
            ]);
        }

        if ($action === 'verify') {
            $orderId = str_field($in['razorpay_order_id'] ?? '', 64);
            $paymentId = str_field($in['razorpay_payment_id'] ?? '', 64);
            $signature = str_field($in['razorpay_signature'] ?? '', 256);
            $rows = $load();
            $i = null;
            foreach ($rows as $k => $r) {
                if ($r['orderId'] === $orderId) $i = $k;
            }
            if ($i === null) fail(404, 'We could not find that payment. Please contact us with your payment id.');
            if ($rows[$i]['status'] === 'paid') ok(['payment' => $rows[$i], 'alreadyVerified' => true]);
            if (!rz_verify_signature($orderId, $paymentId, $signature)) {
                $rows[$i]['status'] = 'failed';
                $rows[$i]['notes'] = 'Signature verification failed';
                $save($rows);
                fail(400, 'We could not verify this payment. Nothing has been activated - please contact us.');
            }
            // A real payment would now be confirmed with Razorpay; the mock
            // stops here because no money is ever taken locally.
            $rows[$i]['status'] = 'paid';
            $rows[$i]['paymentId'] = $paymentId;
            $rows[$i]['paidAt'] = date('Y-m-d H:i:s');
            $save($rows);
            ok(['payment' => $rows[$i]]);
        }

        // DEV ONLY: signs a fake payment so the success screen can be tested
        // without taking real money. Nothing like this exists in api/payment.php.
        if ($action === 'devsign') {
            $o = (string) ($_GET['order_id'] ?? '');
            $p = (string) ($_GET['payment_id'] ?? '');
            $keys = rz_keys();
            ok(['signature' => hash_hmac('sha256', $o . '|' . $p, $keys['secret'] ?? '')]);
        }

        if ($action === 'cancel') {
            $orderId = str_field($in['razorpay_order_id'] ?? $in['orderId'] ?? '', 64);
            $rows = $load();
            foreach ($rows as $k => $r) {
                if ($r['orderId'] === $orderId && $r['status'] === 'created') {
                    $rows[$k]['status'] = ($in['status'] ?? '') === 'failed' ? 'failed' : 'cancelled';
                    $rows[$k]['notes'] = str_field($in['reason'] ?? '', 190);
                }
            }
            $save($rows);
            ok();
        }

        if ($action === 'list') {
            $rows = array_reverse($load());
            $paid = array_filter($rows, static fn($r) => $r['status'] === 'paid');
            ok([
                'enabled' => rz_enabled(),
                'payments' => array_values($rows),
                'totals' => ['paidCount' => count($paid), 'paidAmount' => array_sum(array_column($paid, 'amount'))],
            ]);
        }
        fail(400, 'Unknown action.');

    default:
        fail(404, 'Mock API: no handler for ' . $path);
}
