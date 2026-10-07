<?php
/**
 * Admin image upload.
 *   POST /api/upload.php   (multipart/form-data, field name: file)
 *
 * Saves into /uploads and returns a site-relative URL to store on the
 * category / service record. Keeping images as files rather than base64 keeps
 * the database small and lets the browser cache them.
 */

declare(strict_types=1);
require __DIR__ . '/lib.php';

apply_cors();
require_method('POST');
require_admin();

if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
    fail(422, 'No file received.');
}
$file = $_FILES['file'];

if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    fail(422, 'Upload failed. The file may be larger than the server allows.');
}
if (($file['size'] ?? 0) > 4 * 1024 * 1024) {
    fail(422, 'Please choose an image under 4 MB.');
}
if (!is_uploaded_file($file['tmp_name'])) {
    fail(400, 'Invalid upload.');
}

// Trust the sniffed type, never the name the browser sent.
$allowed = [
    'image/png'     => 'png',
    'image/jpeg'    => 'jpg',
    'image/webp'    => 'webp',
    'image/gif'     => 'gif',
    'image/svg+xml' => 'svg',
];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) ?: '';
if (!isset($allowed[$mime])) {
    fail(422, 'Only PNG, JPG, WEBP, GIF or SVG images are allowed.');
}

$dir = dirname(__DIR__) . '/uploads';
if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
    fail(500, 'Cannot create the uploads folder.');
}
if (!is_writable($dir)) {
    fail(500, 'The uploads folder is not writable. Set it to 755 in File Manager.');
}

$base = slugify_upload((string) ($_POST['name'] ?? pathinfo((string) $file['name'], PATHINFO_FILENAME)));
$filename = ($base !== '' ? $base : 'image') . '-' . bin2hex(random_bytes(4)) . '.' . $allowed[$mime];

if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $filename)) {
    fail(500, 'Could not save the uploaded file.');
}
@chmod($dir . '/' . $filename, 0644);

ok(['url' => '/uploads/' . $filename]);

function slugify_upload(string $text): string
{
    $s = strtolower(trim($text));
    $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
    return substr(trim($s, '-'), 0, 60);
}
