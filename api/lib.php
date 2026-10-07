<?php
/**
 * Shared bootstrap: config, database, JSON helpers and the admin session.
 * Every endpoint starts with  require __DIR__ . '/lib.php';
 */

declare(strict_types=1);

mb_internal_encoding('UTF-8');
date_default_timezone_set('Asia/Kolkata');

// Never print warnings into a JSON body - they would corrupt the response.
ini_set('display_errors', '0');
error_reporting(E_ALL);

// ---------------------------------------------------------------- config
function cfg(?string $key = null)
{
    static $config = null;
    if ($config === null) {
        $file = __DIR__ . '/config.php';
        if (!is_file($file)) {
            fail(500, 'Backend not configured: copy api/config.sample.php to api/config.php and fill in the database details.');
        }
        $config = require $file;
    }
    if ($key === null) {
        return $config;
    }
    return $config[$key] ?? null;
}

// ---------------------------------------------------------------- output
function send(int $status, array $payload): never
{
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: no-store');
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function ok(array $payload = []): never
{
    send(200, ['ok' => true] + $payload);
}

function fail(int $status, string $message, array $extra = []): never
{
    send($status, ['ok' => false, 'error' => $message] + $extra);
}

// Turn fatals into JSON so the admin panel can show a real message.
set_exception_handler(function (Throwable $e): void {
    error_log('[smagizh-api] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    send(500, ['ok' => false, 'error' => 'Server error. Check the PHP error log for details.']);
});

// ---------------------------------------------------------------- CORS (dev only)
function apply_cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = cfg('dev_origins') ?: [];
    if ($origin !== '' && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// ---------------------------------------------------------------- database
function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        cfg('db_host') ?: 'localhost',
        (int) (cfg('db_port') ?: 3306),
        cfg('db_name')
    );
    try {
        $pdo = new PDO($dsn, (string) cfg('db_user'), (string) cfg('db_pass'), [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        error_log('[smagizh-api] DB connect failed: ' . $e->getMessage());
        fail(500, 'Cannot connect to the database. Check the credentials in api/config.php.');
    }
    return $pdo;
}

// ---------------------------------------------------------------- input
/** Decoded JSON request body. */
function body(): array
{
    static $data = null;
    if ($data === null) {
        $raw = file_get_contents('php://input') ?: '';
        $decoded = json_decode($raw, true);
        $data = is_array($decoded) ? $decoded : [];
    }
    return $data;
}

function param(string $key, $default = null)
{
    return $_GET[$key] ?? body()[$key] ?? $default;
}

function require_method(string ...$methods): void
{
    if (!in_array($_SERVER['REQUEST_METHOD'] ?? '', $methods, true)) {
        fail(405, 'Method not allowed.');
    }
}

/** Keep only digits - used for every WhatsApp / mobile number. */
function digits($value): string
{
    return preg_replace('/\D+/', '', (string) $value) ?? '';
}

function str_field($value, int $max = 2000): string
{
    $s = trim((string) $value);
    return mb_substr($s, 0, $max);
}

function json_col($value): string
{
    return json_encode($value ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function json_decode_col(?string $value): array
{
    $d = json_decode((string) $value, true);
    return is_array($d) ? $d : [];
}

// ---------------------------------------------------------------- session
function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,
        'secure'   => $https,
        'samesite' => 'Lax',
    ]);
    session_name('smagizh_admin');
    session_start();
}

function current_admin(): ?array
{
    start_session();
    $id = $_SESSION['admin_id'] ?? null;
    if (!$id) {
        return null;
    }
    $stmt = db()->prepare('SELECT id, username, name FROM admin_users WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/** Guard for every admin-only endpoint. */
function require_admin(): array
{
    $admin = current_admin();
    if (!$admin) {
        fail(401, 'Please sign in again.');
    }
    return $admin;
}
