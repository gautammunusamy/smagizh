<?php
/**
 * Razorpay payments for the Plans section.
 *
 *   GET  /api/payment.php?action=plans    - payable plans + amounts + public key id
 *   POST /api/payment.php?action=create   - create a Razorpay order for a plan
 *   POST /api/payment.php?action=verify   - verify the signature, then activate
 *   POST /api/payment.php?action=cancel   - record a dismissed / failed attempt
 *   GET  /api/payment.php?action=list     - admin only: payment history
 *   POST /api/payment.php?action=webhook  - optional Razorpay webhook receiver
 *
 * The amount is always calculated here from the plan price in the database -
 * never taken from the browser - and a plan is only marked paid after the
 * signature is verified AND the payment is confirmed with Razorpay.
 */

declare(strict_types=1);
require __DIR__ . '/lib.php';
require __DIR__ . '/store.php';
require __DIR__ . '/razorpay.php';

apply_cors();

$action = (string) ($_GET['action'] ?? '');

/** Plans that can be paid for online: active, not free, priced. */
function payable_plans(): array
{
    $out = [];
    foreach (all_plans() as $p) {
        if (empty($p['active']) || !empty($p['free']) || (float) ($p['price'] ?? 0) <= 0) {
            continue;
        }
        $out[(string) $p['id']] = $p;
    }
    return $out;
}

function payment_from_row(array $r): array
{
    return [
        'id'        => $r['id'],
        'planId'    => $r['plan_id'],
        'planName'  => $r['plan_name'],
        'billing'   => $r['billing'],
        'months'    => (int) $r['months'],
        'amount'    => round(((int) $r['amount_paise']) / 100, 2),
        'currency'  => $r['currency'],
        'status'    => $r['status'],
        'orderId'   => $r['order_id'],
        'paymentId' => $r['payment_id'],
        'method'    => $r['method'],
        'name'      => $r['name'],
        'email'     => $r['email'],
        'contact'   => $r['contact'],
        'business'  => $r['business'],
        'notes'     => $r['notes'],
        'createdAt' => $r['created_at'],
        'paidAt'    => $r['paid_at'],
    ];
}

switch ($action) {
    // ------------------------------------------------------------ plans
    case 'plans': {
        require_method('GET');
        $settings = get_setting('site', []);
        $list = [];
        foreach (payable_plans() as $id => $p) {
            $monthly = rz_plan_amount($p, 'monthly', $settings);
            $annual = rz_plan_amount($p, 'annual', $settings);
            $list[] = [
                'id'      => $id,
                'name'    => $p['name'] ?? '',
                'monthly' => ['amount' => $monthly['total'], 'months' => 1, 'perMonth' => $monthly['perMonth']],
                'annual'  => ['amount' => $annual['total'], 'months' => 12, 'perMonth' => $annual['perMonth']],
            ];
        }
        ok([
            'enabled'  => rz_enabled(),
            'keyId'    => rz_key_id(),
            'currency' => 'INR',
            'plans'    => $list,
        ]);
    }

    // ------------------------------------------------------------ create order
    case 'create': {
        require_method('POST');
        if (!rz_enabled()) {
            fail(503, 'Online payment is not available right now. Please send an enquiry instead.');
        }

        $in = body();
        $planId = str_field($in['planId'] ?? '', 64);
        $billing = ($in['billing'] ?? 'monthly') === 'annual' ? 'annual' : 'monthly';
        $name = str_field($in['name'] ?? '', 190);
        $email = str_field($in['email'] ?? '', 190);
        $contact = digits($in['contact'] ?? '');
        $business = str_field($in['business'] ?? '', 190);

        if ($name === '') {
            fail(422, 'Please enter your name.');
        }
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            fail(422, 'Please enter a valid email address.');
        }
        if (strlen($contact) < 10) {
            fail(422, 'Please enter a valid 10-digit mobile number.');
        }

        $plans = payable_plans();
        if (!isset($plans[$planId])) {
            fail(404, 'That plan is not available for online payment.');
        }
        $plan = $plans[$planId];
        $settings = get_setting('site', []);
        $amount = rz_plan_amount($plan, $billing, $settings);
        if ($amount['paise'] < 100) {
            fail(422, 'This plan cannot be paid online. Please contact us.');
        }

        // Simple abuse guard: at most 20 order attempts per hour per visitor.
        $ipHash = rz_ip_hash();
        $stmt = db()->prepare('SELECT COUNT(*) FROM payments WHERE ip_hash = ? AND created_at > (NOW() - INTERVAL 1 HOUR)');
        $stmt->execute([$ipHash]);
        if ((int) $stmt->fetchColumn() >= 20) {
            fail(429, 'Too many payment attempts. Please try again later.');
        }

        $ref = 'PAY-' . date('Y') . '-' . random_int(100000, 999999);
        $order = rz_api('POST', '/orders', [
            'amount'          => $amount['paise'],
            'currency'        => 'INR',
            'receipt'         => $ref,
            'payment_capture' => 1,
            'notes'           => [
                'reference' => $ref,
                'plan'      => (string) ($plan['name'] ?? ''),
                'billing'   => $amount['billing'],
                'months'    => (string) $amount['months'],
                'business'  => $business,
            ],
        ]);

        upsert('payments', [
            'id'           => $ref,
            'plan_id'      => $planId,
            'plan_name'    => (string) ($plan['name'] ?? ''),
            'billing'      => $amount['billing'],
            'months'       => $amount['months'],
            'amount_paise' => $amount['paise'],
            'currency'     => 'INR',
            'status'       => 'created',
            'order_id'     => (string) ($order['id'] ?? ''),
            'payment_id'   => '',
            'method'       => '',
            'name'         => $name,
            'email'        => $email,
            'contact'      => $contact,
            'business'     => $business,
            'notes'        => '',
            'ip_hash'      => $ipHash,
            'created_at'   => date('Y-m-d H:i:s'),
        ]);

        ok([
            'reference' => $ref,
            'orderId'   => $order['id'] ?? '',
            'amount'    => $amount['paise'],
            'display'   => $amount['total'],
            'currency'  => 'INR',
            'months'    => $amount['months'],
            'billing'   => $amount['billing'],
            'planName'  => $plan['name'] ?? '',
            'keyId'     => rz_key_id(),
            'prefill'   => ['name' => $name, 'email' => $email, 'contact' => $contact],
        ]);
    }

    // ------------------------------------------------------------ verify + activate
    case 'verify': {
        require_method('POST');
        $in = body();
        $orderId = str_field($in['razorpay_order_id'] ?? '', 64);
        $paymentId = str_field($in['razorpay_payment_id'] ?? '', 64);
        $signature = str_field($in['razorpay_signature'] ?? '', 256);

        if ($orderId === '' || $paymentId === '') {
            fail(422, 'Missing payment details.');
        }

        $stmt = db()->prepare('SELECT * FROM payments WHERE order_id = ? LIMIT 1');
        $stmt->execute([$orderId]);
        $row = $stmt->fetch();
        if (!$row) {
            fail(404, 'We could not find that payment. Please contact us with your payment id.');
        }

        // Already verified - return the same result instead of processing twice.
        if ($row['status'] === 'paid') {
            ok(['payment' => payment_from_row($row), 'alreadyVerified' => true]);
        }

        if (!rz_verify_signature($orderId, $paymentId, $signature)) {
            db()->prepare('UPDATE payments SET status = ?, payment_id = ?, notes = ? WHERE id = ?')
                ->execute(['failed', $paymentId, 'Signature verification failed', $row['id']]);
            error_log('[smagizh-pay] signature mismatch for order ' . $orderId);
            fail(400, 'We could not verify this payment. Nothing has been activated - please contact us.');
        }

        // Signature is good; confirm with Razorpay that the money is really there.
        $payment = rz_api('GET', '/payments/' . rawurlencode($paymentId));
        $status = (string) ($payment['status'] ?? '');
        $amountPaid = (int) ($payment['amount'] ?? 0);
        $expected = (int) $row['amount_paise'];

        if ((string) ($payment['order_id'] ?? '') !== $orderId || $amountPaid !== $expected) {
            db()->prepare('UPDATE payments SET status = ?, payment_id = ?, notes = ? WHERE id = ?')
                ->execute(['failed', $paymentId, 'Order or amount mismatch', $row['id']]);
            fail(400, 'This payment does not match the order. Nothing has been activated - please contact us.');
        }

        if ($status === 'authorized') {
            $payment = rz_api('POST', '/payments/' . rawurlencode($paymentId) . '/capture', [
                'amount'   => $expected,
                'currency' => 'INR',
            ]);
            $status = (string) ($payment['status'] ?? '');
        }

        if ($status !== 'captured') {
            db()->prepare('UPDATE payments SET status = ?, payment_id = ?, notes = ? WHERE id = ?')
                ->execute(['failed', $paymentId, 'Payment status: ' . $status, $row['id']]);
            fail(400, 'The payment was not completed. Nothing has been charged for this plan.');
        }

        db()->prepare('UPDATE payments SET status = ?, payment_id = ?, method = ?, paid_at = ?, notes = ? WHERE id = ?')
            ->execute(['paid', $paymentId, (string) ($payment['method'] ?? ''), date('Y-m-d H:i:s'), '', $row['id']]);

        // Log it as an enquiry too, so the team sees the sale in Admin -> Enquiries.
        $enquiry = [
            'id'          => 'ENQ-' . date('Y') . '-' . random_int(10000, 99999),
            'owner'       => $row['name'],
            'business'    => $row['business'],
            'mobile'      => $row['contact'],
            'whatsapp'    => $row['contact'],
            'email'       => $row['email'],
            'categoryId'  => '',
            'plan'        => $row['plan_name'] . ($row['billing'] === 'annual' ? ' (Annual)' : ' (Monthly)'),
            'status'      => 'Service Confirmed',
            'assignedTo'  => 'Unassigned',
            'source'      => 'Online payment · ' . $row['id'],
            'routedTo'    => digits((get_setting('site', [])['defaultWhatsapp'] ?? '')),
            'routedTeam'  => 'Default',
            'message'     => sprintf('Paid %s %s for %d month(s). Payment id %s.', 'INR', number_format($expected / 100, 2), (int) $row['months'], $paymentId),
            'createdAt'   => date('c'),
        ];
        upsert('enquiries', enquiry_to_row($enquiry));

        $stmt = db()->prepare('SELECT * FROM payments WHERE id = ? LIMIT 1');
        $stmt->execute([$row['id']]);
        ok(['payment' => payment_from_row($stmt->fetch() ?: $row), 'enquiryId' => $enquiry['id']]);
    }

    // ------------------------------------------------------------ cancelled / failed
    case 'cancel': {
        require_method('POST');
        $in = body();
        $orderId = str_field($in['razorpay_order_id'] ?? $in['orderId'] ?? '', 64);
        $reason = str_field($in['reason'] ?? 'Cancelled by user', 190);
        $state = ($in['status'] ?? '') === 'failed' ? 'failed' : 'cancelled';
        if ($orderId !== '') {
            db()->prepare("UPDATE payments SET status = ?, notes = ? WHERE order_id = ? AND status = 'created'")
                ->execute([$state, $reason, $orderId]);
        }
        ok();
    }

    // ------------------------------------------------------------ admin list
    case 'list': {
        require_method('GET');
        require_admin();
        $rows = db()->query('SELECT * FROM payments ORDER BY created_at DESC LIMIT 500')->fetchAll();
        $paid = db()->query("SELECT COUNT(*) c, COALESCE(SUM(amount_paise),0) s FROM payments WHERE status = 'paid'")->fetch();
        ok([
            'enabled'  => rz_enabled(),
            'payments' => array_map('payment_from_row', $rows),
            'totals'   => ['paidCount' => (int) $paid['c'], 'paidAmount' => round(((int) $paid['s']) / 100, 2)],
        ]);
    }

    // ------------------------------------------------------------ webhook (optional)
    case 'webhook': {
        require_method('POST');
        $raw = file_get_contents('php://input') ?: '';
        $sig = (string) ($_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '');
        if (!rz_verify_webhook($raw, $sig)) {
            fail(400, 'Invalid signature.');
        }
        $event = json_decode($raw, true);
        $entity = $event['payload']['payment']['entity'] ?? [];
        $orderId = (string) ($entity['order_id'] ?? '');
        $paymentId = (string) ($entity['id'] ?? '');
        $name = (string) ($event['event'] ?? '');
        if ($orderId !== '' && $name === 'payment.captured') {
            db()->prepare("UPDATE payments SET status = 'paid', payment_id = ?, method = ?, paid_at = COALESCE(paid_at, NOW()) WHERE order_id = ? AND status <> 'paid'")
                ->execute([$paymentId, (string) ($entity['method'] ?? ''), $orderId]);
        } elseif ($orderId !== '' && $name === 'payment.failed') {
            db()->prepare("UPDATE payments SET status = 'failed', payment_id = ?, notes = ? WHERE order_id = ? AND status = 'created'")
                ->execute([$paymentId, str_field($entity['error_description'] ?? 'Payment failed', 190), $orderId]);
        }
        ok();
    }

    default:
        fail(400, 'Unknown action.');
}
