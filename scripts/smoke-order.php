<?php
/**
 * Live smoke test: creates one ₹1 Razorpay order and reads it back.
 * Creating an order does NOT charge anyone - it only proves the credentials
 * and the server code path work. Never prints the key secret.
 *   php scripts/smoke-order.php
 */
declare(strict_types=1);
require __DIR__ . '/../api/lib.php';
require __DIR__ . '/../api/razorpay.php';

echo 'Payments enabled: ' . (rz_enabled() ? 'yes' : 'no') . "\n";
echo 'Key id in use:    ' . substr(rz_key_id(), 0, 12) . "...\n";

$receipt = 'smoke-' . date('Ymd-His');
$order = rz_api('POST', '/orders', [
    'amount'   => 100,
    'currency' => 'INR',
    'receipt'  => $receipt,
    'notes'    => ['purpose' => 'integration smoke test - no payment taken'],
]);
echo "\nOrder created\n";
echo '  id:       ' . $order['id'] . "\n";
echo '  amount:   ' . $order['amount'] . " paise\n";
echo '  status:   ' . $order['status'] . "\n";
echo '  receipt:  ' . $order['receipt'] . "\n";

$back = rz_api('GET', '/orders/' . $order['id']);
echo "\nRead back from Razorpay: " . $back['id'] . ' / ' . $back['status'] . "\n";
echo "\nNo payment was made. The order expires on its own.\n";
