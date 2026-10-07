<?php
/**
 * Offline checks for the Razorpay helpers - no network, no database, no money.
 *   php scripts/test-razorpay.php
 *
 * Uses a dummy secret, so it never touches the live credentials.
 */

declare(strict_types=1);

$CONFIG = [
    'razorpay_key_id'     => 'rzp_test_dummy',
    'razorpay_key_secret' => 'dummy_secret_for_tests',
    'db_name'             => 'test_db',
];
function cfg(?string $key = null)
{
    global $CONFIG;
    return $key === null ? $CONFIG : ($CONFIG[$key] ?? null);
}
function fail(int $status, string $message, array $extra = []): never
{
    throw new RuntimeException("fail($status): $message");
}

require __DIR__ . '//../api/razorpay.php';

$pass = 0;
$failed = 0;
function check(string $label, $actual, $expected): void
{
    global $pass, $failed;
    $ok = $actual === $expected;
    $ok ? $pass++ : $failed++;
    printf("%-58s %s\n", $label, $ok ? 'ok' : "FAILED (got " . var_export($actual, true) . ", want " . var_export($expected, true) . ")");
}

$settings = ['monthlyDiscount' => 5, 'annualDiscount' => 20];
$basic = ['id' => 'basic', 'name' => 'Basic Plan', 'price' => 4999];
$business = ['id' => 'business', 'name' => 'Business Plan', 'price' => 8999];
$premium = ['id' => 'premium', 'name' => 'Premium Plan', 'price' => 14999];

echo "Amounts (server-side, from the plan price + admin discounts)\n";
$m = rz_plan_amount($basic, 'monthly', $settings);
check('Basic monthly total (5% off 4,999)', $m['total'], 4749.05);
check('Basic monthly in paise', $m['paise'], 474905);
check('Basic monthly months', $m['months'], 1);

$a = rz_plan_amount($basic, 'annual', $settings);
check('Basic annual per month (20% off)', $a['perMonth'], 3999.20);
check('Basic annual total (12 months)', $a['total'], 47990.40);
check('Basic annual in paise', $a['paise'], 4799040);

check('Business monthly paise', rz_plan_amount($business, 'monthly', $settings)['paise'], 854905);
check('Business annual paise', rz_plan_amount($business, 'annual', $settings)['paise'], 8639040);
check('Premium monthly paise', rz_plan_amount($premium, 'monthly', $settings)['paise'], 1424905);
check('Premium annual paise', rz_plan_amount($premium, 'annual', $settings)['paise'], 14399040);

check('Unknown billing falls back to monthly', rz_plan_amount($basic, 'weekly', $settings)['billing'], 'monthly');
check('Discounts can be changed in the admin (0%)', rz_plan_amount($basic, 'monthly', ['monthlyDiscount' => 0])['paise'], 499900);

echo "\nSignature verification\n";
$orderId = 'order_TestOrder123';
$paymentId = 'pay_TestPayment456';
$good = hash_hmac('sha256', $orderId . '|' . $paymentId, 'dummy_secret_for_tests');
check('Valid signature accepted', rz_verify_signature($orderId, $paymentId, $good), true);
check('Tampered signature rejected', rz_verify_signature($orderId, $paymentId, substr($good, 0, -1) . '0'), false);
check('Empty signature rejected', rz_verify_signature($orderId, $paymentId, ''), false);
check('Signature of another order rejected', rz_verify_signature('order_Other', $paymentId, $good), false);
check('Signature of another payment rejected', rz_verify_signature($orderId, 'pay_Other', $good), false);

echo "\nWebhook signature\n";
$CONFIG['razorpay_webhook_secret'] = 'hook_secret';
$body = '{"event":"payment.captured"}';
check('Valid webhook signature accepted', rz_verify_webhook($body, hash_hmac('sha256', $body, 'hook_secret')), true);
check('Wrong webhook signature rejected', rz_verify_webhook($body, 'nope'), false);

echo "\nCredentials handling\n";
check('Payments enabled with real-looking keys', rz_enabled(), true);
$CONFIG['razorpay_key_id'] = 'YOUR_RAZORPAY_KEY_ID';
check('Placeholder keys = payments switched off', rz_enabled(), false);
$CONFIG['razorpay_key_id'] = 'rzp_test_dummy';
$CONFIG['razorpay_key_secret'] = '';
check('Missing secret = payments switched off', rz_enabled(), false);

printf("\n%d passed, %d failed\n", $pass, $failed);
exit($failed === 0 ? 0 : 1);
