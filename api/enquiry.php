<?php
/**
 * Public enquiry submission.
 *   POST /api/enquiry.php   { owner, business, mobile, categoryId, ... }
 *
 * Stores the enquiry so it appears in Admin -> Enquiries, and returns the id
 * plus the WhatsApp number it should be routed to. Routing is resolved on the
 * server so the visitor cannot change where an enquiry lands.
 */

declare(strict_types=1);
require __DIR__ . '/lib.php';
require __DIR__ . '/store.php';

apply_cors();
require_method('POST');

$in = body();

$owner = str_field($in['owner'] ?? '', 190);
$mobile = digits($in['mobile'] ?? $in['whatsapp'] ?? '');
if ($owner === '') {
    fail(422, 'Please enter your name.');
}
if (strlen($mobile) < 10) {
    fail(422, 'Please enter a valid mobile number.');
}

// ---- resolve routing: category number -> service number -> default ----
$settings = get_setting('site', []);
$categoryId = str_field($in['categoryId'] ?? '', 64);
$serviceName = str_field($in['service'] ?? '', 190);

$categoryNumber = '';
$categoryTeam = '';
if ($categoryId !== '') {
    $stmt = db()->prepare('SELECT whatsapp, team FROM categories WHERE id = ? LIMIT 1');
    $stmt->execute([$categoryId]);
    if ($row = $stmt->fetch()) {
        $categoryNumber = digits($row['whatsapp']);
        $categoryTeam = (string) $row['team'];
    }
}

$serviceNumber = '';
if ($categoryNumber === '' && $serviceName !== '') {
    $stmt = db()->prepare('SELECT whatsapp FROM services WHERE name = ? LIMIT 1');
    $stmt->execute([$serviceName]);
    if ($row = $stmt->fetch()) {
        $serviceNumber = digits($row['whatsapp']);
    }
}

$routedTo = $categoryNumber ?: ($serviceNumber ?: digits($settings['defaultWhatsapp'] ?? ''));

$enquiry = $in;
$enquiry['id'] = 'ENQ-' . date('Y') . '-' . random_int(10000, 99999);
$enquiry['owner'] = $owner;
$enquiry['mobile'] = $mobile;
$enquiry['status'] = 'New';
$enquiry['assignedTo'] = 'Unassigned';
$enquiry['routedTo'] = $routedTo;
$enquiry['routedTeam'] = $categoryTeam ?: ($enquiry['routedTeam'] ?? 'Default');
$enquiry['createdAt'] = date('c');

upsert('enquiries', enquiry_to_row($enquiry));

ok([
    'id'         => $enquiry['id'],
    'routedTo'   => $routedTo,
    'routedTeam' => $enquiry['routedTeam'],
]);
