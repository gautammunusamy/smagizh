<?php
/**
 * Admin session.
 *
 *   GET  /api/auth.php?action=me
 *   POST /api/auth.php?action=login     { username, password }
 *   POST /api/auth.php?action=logout
 *   POST /api/auth.php?action=password  { current, next }
 */

declare(strict_types=1);
require __DIR__ . '/lib.php';

apply_cors();

$action = (string) param('action', 'me');

// ---------------------------------------------------------------- me
if ($action === 'me') {
    $admin = current_admin();
    ok(['user' => $admin ? ['username' => $admin['username'], 'name' => $admin['name']] : null]);
}

// ---------------------------------------------------------------- login
if ($action === 'login') {
    require_method('POST');
    start_session();

    // Simple brute-force brake: 5 failures per session, then a short lockout.
    $now = time();
    $tries = $_SESSION['login_tries'] ?? 0;
    $until = $_SESSION['login_block_until'] ?? 0;
    if ($until > $now) {
        fail(429, 'Too many attempts. Please wait a minute and try again.');
    }

    $username = strtolower(str_field(param('username', ''), 64));
    $password = (string) param('password', '');

    $stmt = db()->prepare('SELECT id, username, name, password_hash FROM admin_users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $row = $stmt->fetch();

    if (!$row || !password_verify($password, $row['password_hash'])) {
        $_SESSION['login_tries'] = $tries + 1;
        if ($_SESSION['login_tries'] >= 5) {
            $_SESSION['login_block_until'] = $now + 60;
            $_SESSION['login_tries'] = 0;
        }
        fail(401, 'Invalid username or password.');
    }

    // Refresh a hash whose algorithm/cost has since changed.
    if (password_needs_rehash($row['password_hash'], PASSWORD_DEFAULT)) {
        db()->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')
            ->execute([password_hash($password, PASSWORD_DEFAULT), $row['id']]);
    }

    session_regenerate_id(true);
    $_SESSION['admin_id'] = (int) $row['id'];
    unset($_SESSION['login_tries'], $_SESSION['login_block_until']);
    db()->prepare('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?')->execute([$row['id']]);

    ok(['user' => ['username' => $row['username'], 'name' => $row['name']]]);
}

// ---------------------------------------------------------------- logout
if ($action === 'logout') {
    require_method('POST');
    start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    ok(['user' => null]);
}

// ---------------------------------------------------------------- change password
if ($action === 'password') {
    require_method('POST');
    $admin = require_admin();

    $current = (string) param('current', '');
    $next    = (string) param('next', '');

    if (strlen($next) < 8) {
        fail(422, 'The new password must be at least 8 characters.');
    }
    if ($next === $current) {
        fail(422, 'The new password must be different from the current one.');
    }

    $stmt = db()->prepare('SELECT password_hash FROM admin_users WHERE id = ? LIMIT 1');
    $stmt->execute([$admin['id']]);
    $hash = (string) $stmt->fetchColumn();

    if (!password_verify($current, $hash)) {
        fail(401, 'Your current password is not correct.');
    }

    db()->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')
        ->execute([password_hash($next, PASSWORD_DEFAULT), $admin['id']]);

    ok(['message' => 'Password updated.']);
}

fail(400, 'Unknown action.');
