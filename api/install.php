<?php
/**
 * One-time installer.
 *
 *   https://smagizh.com/api/install.php?token=YOUR_INSTALL_TOKEN
 *
 * Creates every table from schema.sql, imports seed.json (17 categories with
 * their 216 subcategories, services, plans, comparison rows, FAQs,
 * testimonials) and creates the first admin user from config.php.
 *
 * Safe to re-run: content rows are only inserted when a collection is still
 * empty, so it will not overwrite edits made in the admin panel. Pass
 * &force=content to deliberately re-import the seed over existing content.
 *
 * DELETE THIS FILE once the site is live.
 */

declare(strict_types=1);
require __DIR__ . '/lib.php';
require __DIR__ . '/store.php';

header('Content-Type: text/plain; charset=utf-8');

$token = (string) cfg('install_token');
if ($token === '' || $token === 'CHANGE_THIS_TO_A_LONG_RANDOM_STRING') {
    http_response_code(403);
    exit("Set a real install_token in api/config.php first.\n");
}
if (!hash_equals($token, (string) ($_GET['token'] ?? ''))) {
    http_response_code(403);
    exit("Invalid install token.\n");
}

$force = ($_GET['force'] ?? '') === 'content';
$log = static function (string $line): void {
    echo $line . "\n";
    flush();
};

$log('Smagizh Marketing - installer');
$log(str_repeat('-', 46));

// ---------------------------------------------------------------- tables
$sql = file_get_contents(__DIR__ . '/schema.sql');
if ($sql === false) {
    exit("schema.sql is missing.\n");
}
foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
    if (str_starts_with($statement, '--') || $statement === '') {
        continue;
    }
    db()->exec($statement);
}
$log('Tables created / verified.');

// ---------------------------------------------------------------- seed data
$seedFile = __DIR__ . '/seed.json';
$seed = is_file($seedFile) ? json_decode((string) file_get_contents($seedFile), true) : null;

if (!is_array($seed)) {
    $log('WARNING: seed.json missing - tables are empty. Add content in the admin panel.');
} else {
    $count = static fn(string $t): int => (int) db()->query("SELECT COUNT(*) FROM `$t`")->fetchColumn();

    $import = static function (string $table, array $items, callable $toRow, callable $logger) use ($force, $count): void {
        if ($count($table) > 0 && !$force) {
            $logger(sprintf('%-16s skipped (%d rows already present)', $table, $count($table)));
            return;
        }
        $i = 0;
        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }
            if (!isset($item['order'])) {
                $item['order'] = $i + 1;
            }
            upsert($table, $toRow($item, $i));
            $i++;
        }
        $logger(sprintf('%-16s imported %d rows', $table, $i));
    };

    db()->beginTransaction();
    try {
        $import('categories', $seed['categories'] ?? [], fn($x) => category_to_row($x), $log);
        $import('services', $seed['services'] ?? [], fn($x) => service_to_row($x), $log);
        $import('plans', $seed['plans'] ?? [], fn($x) => plan_to_row($x), $log);
        $import('comparison_rows', $seed['comparison'] ?? [], fn($x, $i) => comparison_to_row($x, $i), $log);
        $import('faqs', $seed['faqs'] ?? [], fn($x) => faq_to_row($x), $log);
        $import('testimonials', $seed['testimonials'] ?? [], fn($x) => testimonial_to_row($x), $log);

        if (get_setting('site') === null || $force) {
            put_setting('site', $seed['settings'] ?? []);
            $log('settings         imported');
        } else {
            $log('settings         skipped (already set)');
        }
        db()->commit();
    } catch (Throwable $e) {
        db()->rollBack();
        throw $e;
    }

    $subs = 0;
    foreach ($seed['categories'] ?? [] as $c) {
        $subs += count($c['subcategories'] ?? []);
    }
    $log(sprintf('(%d subcategories stored inside the category rows)', $subs));
}

// ---------------------------------------------------------------- admin user
$username = strtolower(trim((string) cfg('admin_username')));
$password = (string) cfg('admin_password');
if ($username === '' || strlen($password) < 8) {
    $log('WARNING: admin_username / admin_password missing in config.php (password must be 8+ characters).');
} else {
    $stmt = db()->prepare('SELECT id FROM admin_users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    if ($stmt->fetchColumn()) {
        $log("Admin user '$username' already exists - password left unchanged.");
    } else {
        db()->prepare('INSERT INTO admin_users (username, password_hash, name) VALUES (?, ?, ?)')
            ->execute([$username, password_hash($password, PASSWORD_DEFAULT), (string) cfg('admin_name') ?: 'Admin']);
        $log("Admin user '$username' created.");
    }
}

// ---------------------------------------------------------------- uploads
$uploads = dirname(__DIR__) . '/uploads';
if (!is_dir($uploads)) {
    @mkdir($uploads, 0755, true);
}
$log(is_writable($uploads) ? 'uploads/ ready.' : 'WARNING: uploads/ is not writable - image uploads will fail.');

$log(str_repeat('-', 46));
$log('Done. Sign in at /admin');
$log('NOW DELETE api/install.php.');
