<?php
/**
 * Admin writes. Every request requires a signed-in admin session.
 *
 *   POST /api/admin.php?resource=categories&action=save     { item }
 *   POST /api/admin.php?resource=categories&action=delete   { id }
 *   POST /api/admin.php?resource=categories&action=reorder  { ids: [...] }
 *   POST /api/admin.php?resource=comparison&action=replace  { items: [...] }
 *   POST /api/admin.php?resource=settings&action=save       { item }
 *   POST /api/admin.php?resource=enquiries&action=save|delete
 *
 * Saving always returns the updated collection so the panel and the public
 * site stay in step without a second request.
 */

declare(strict_types=1);
require __DIR__ . '/lib.php';
require __DIR__ . '/store.php';

apply_cors();
require_method('POST');
require_admin();

$resource = (string) param('resource', '');
$action   = (string) param('action', '');

/** table, row mapper, reader */
$map = [
    'categories'   => ['categories', 'category_to_row', 'all_categories'],
    'services'     => ['services', 'service_to_row', 'all_services'],
    'plans'        => ['plans', 'plan_to_row', 'all_plans'],
    'faqs'         => ['faqs', 'faq_to_row', 'all_faqs'],
    'testimonials' => ['testimonials', 'testimonial_to_row', 'all_testimonials'],
    'comparison'   => ['comparison_rows', 'comparison_to_row', 'all_comparison'],
    'enquiries'    => ['enquiries', 'enquiry_to_row', 'all_enquiries'],
];

// ---------------------------------------------------------------- settings
if ($resource === 'settings') {
    if ($action !== 'save') {
        fail(400, 'Unknown action for settings.');
    }
    $item = param('item');
    if (!is_array($item)) {
        fail(422, 'No settings supplied.');
    }
    // Normalise the numbers the site relies on.
    if (isset($item['defaultWhatsapp'])) {
        $item['defaultWhatsapp'] = digits($item['defaultWhatsapp']);
    }
    put_setting('site', $item);
    ok(['settings' => get_setting('site', [])]);
}

if (!isset($map[$resource])) {
    fail(400, 'Unknown resource.');
}
[$table, $toRow, $readAll] = $map[$resource];

// ---------------------------------------------------------------- save one
if ($action === 'save') {
    $item = param('item');
    if (!is_array($item)) {
        fail(422, 'No item supplied.');
    }

    $row = $toRow($item);

    // Slugs must stay unique - two categories sharing one would break routing.
    if (isset($row['slug'])) {
        if ($row['slug'] === '') {
            fail(422, 'A name is required.');
        }
        $stmt = db()->prepare("SELECT id FROM `$table` WHERE slug = ? AND id <> ? LIMIT 1");
        $stmt->execute([$row['slug'], $row['id']]);
        if ($stmt->fetchColumn()) {
            fail(422, 'Another entry already uses the web address "' . $row['slug'] . '". Choose a different name or slug.');
        }
    }

    upsert($table, $row);
    ok([$resource => $readAll()]);
}

// ---------------------------------------------------------------- delete one
if ($action === 'delete') {
    $id = str_field(param('id', ''), 64);
    if ($id === '') {
        fail(422, 'No id supplied.');
    }
    delete_row($table, $id);
    ok([$resource => $readAll()]);
}

// ---------------------------------------------------------------- reorder
if ($action === 'reorder') {
    $ids = param('ids');
    if (!is_array($ids)) {
        fail(422, 'No order supplied.');
    }
    $stmt = db()->prepare("UPDATE `$table` SET sort_order = ? WHERE id = ?");
    db()->beginTransaction();
    try {
        foreach (array_values($ids) as $i => $id) {
            $stmt->execute([$i + 1, (string) $id]);
        }
        db()->commit();
    } catch (Throwable $e) {
        db()->rollBack();
        throw $e;
    }
    ok([$resource => $readAll()]);
}

// ---------------------------------------------------------------- replace all
// Used by the comparison-table editor, which saves every row at once.
if ($action === 'replace') {
    $items = param('items');
    if (!is_array($items)) {
        fail(422, 'No items supplied.');
    }
    db()->beginTransaction();
    try {
        $keep = [];
        foreach (array_values($items) as $i => $item) {
            if (!is_array($item)) {
                continue;
            }
            $row = $toRow($item, $i);
            $row['sort_order'] = $i + 1;
            upsert($table, $row);
            $keep[] = $row['id'];
        }
        if ($keep) {
            $in = implode(',', array_fill(0, count($keep), '?'));
            db()->prepare("DELETE FROM `$table` WHERE id NOT IN ($in)")->execute($keep);
        } else {
            db()->exec("DELETE FROM `$table`");
        }
        db()->commit();
    } catch (Throwable $e) {
        db()->rollBack();
        throw $e;
    }
    ok([$resource => $readAll()]);
}

fail(400, 'Unknown action.');
