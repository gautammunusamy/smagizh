<?php
/**
 * Row <-> object mapping.
 *
 * The React app already has settled shapes for categories, services, plans,
 * FAQs and so on. These helpers keep the API returning exactly those shapes, so
 * the front end does not care that the data now comes from MySQL.
 */

declare(strict_types=1);

// ---------------------------------------------------------------- helpers
function b(array $row, string $key): bool
{
    return (bool) (int) ($row[$key] ?? 0);
}

function pick(array $src, array $keys): array
{
    $out = [];
    foreach ($keys as $k) {
        if (array_key_exists($k, $src)) {
            $out[$k] = $src[$k];
        }
    }
    return $out;
}

/** Everything in $item except the keys stored in real columns. */
function rest(array $item, array $columnKeys): array
{
    return array_diff_key($item, array_flip($columnKeys));
}

function new_id(string $prefix): string
{
    return $prefix . '-' . bin2hex(random_bytes(5));
}

function slugify(string $text): string
{
    $s = strtolower(trim($text));
    $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
    return trim($s, '-');
}

// ---------------------------------------------------------------- categories
const CATEGORY_COLS = ['id', 'slug', 'name', 'group', 'icon', 'color', 'image', 'banner', 'team', 'whatsapp', 'order', 'active'];

function category_from_row(array $r): array
{
    return array_merge(json_decode_col($r['data']), [
        'id'       => $r['id'],
        'slug'     => $r['slug'],
        'name'     => $r['name'],
        'group'    => $r['group_id'],
        'icon'     => $r['icon'],
        'color'    => $r['color'],
        'image'    => (string) ($r['image'] ?? ''),
        'banner'   => (string) ($r['banner'] ?? ''),
        'team'     => $r['team'],
        'whatsapp' => $r['whatsapp'],
        'order'    => (int) $r['sort_order'],
        'active'   => b($r, 'active'),
    ]);
}

function category_to_row(array $c): array
{
    $name = str_field($c['name'] ?? '', 190);
    $slug = slugify((string) ($c['slug'] ?? '')) ?: slugify($name);
    return [
        'id'         => str_field($c['id'] ?? '', 64) ?: new_id('cat'),
        'slug'       => $slug,
        'name'       => $name,
        'group_id'   => str_field($c['group'] ?? '', 64),
        'icon'       => str_field($c['icon'] ?? 'box', 64),
        'color'      => str_field($c['color'] ?? 'violet', 32),
        'image'      => (string) ($c['image'] ?? ''),
        'banner'     => (string) ($c['banner'] ?? ''),
        'team'       => str_field($c['team'] ?? 'Default', 64),
        'whatsapp'   => digits($c['whatsapp'] ?? ''),
        'sort_order' => (int) ($c['order'] ?? 0),
        'active'     => !empty($c['active']) ? 1 : 0,
        'data'       => json_col(rest($c, CATEGORY_COLS)),
    ];
}

// ---------------------------------------------------------------- services
const SERVICE_COLS = ['id', 'slug', 'name', 'icon', 'color', 'image', 'whatsapp', 'order', 'active'];

function service_from_row(array $r): array
{
    return array_merge(json_decode_col($r['data']), [
        'id'       => $r['id'],
        'slug'     => $r['slug'],
        'name'     => $r['name'],
        'icon'     => $r['icon'],
        'color'    => $r['color'],
        'image'    => (string) ($r['image'] ?? ''),
        'whatsapp' => $r['whatsapp'],
        'order'    => (int) $r['sort_order'],
        'active'   => b($r, 'active'),
    ]);
}

function service_to_row(array $s): array
{
    $name = str_field($s['name'] ?? '', 190);
    $slug = slugify((string) ($s['slug'] ?? '')) ?: slugify($name);
    return [
        'id'         => str_field($s['id'] ?? '', 64) ?: new_id('svc'),
        'slug'       => $slug,
        'name'       => $name,
        'icon'       => str_field($s['icon'] ?? 'megaphone', 64),
        'color'      => str_field($s['color'] ?? 'violet', 32),
        'image'      => (string) ($s['image'] ?? ''),
        'whatsapp'   => digits($s['whatsapp'] ?? ''),
        'sort_order' => (int) ($s['order'] ?? 0),
        'active'     => !empty($s['active']) ? 1 : 0,
        'data'       => json_col(rest($s, SERVICE_COLS)),
    ];
}

// ---------------------------------------------------------------- plans
const PLAN_COLS = ['id', 'name', 'price', 'free', 'recommended', 'order', 'active'];

function plan_from_row(array $r): array
{
    return array_merge(json_decode_col($r['data']), [
        'id'          => $r['id'],
        'name'        => $r['name'],
        'price'       => (float) $r['price'],
        'free'        => b($r, 'is_free'),
        'recommended' => b($r, 'recommended'),
        'order'       => (int) $r['sort_order'],
        'active'      => b($r, 'active'),
    ]);
}

function plan_to_row(array $p): array
{
    return [
        'id'          => str_field($p['id'] ?? '', 64) ?: new_id('plan'),
        'name'        => str_field($p['name'] ?? '', 190),
        'price'       => (float) ($p['price'] ?? 0),
        'is_free'     => !empty($p['free']) ? 1 : 0,
        'recommended' => !empty($p['recommended']) ? 1 : 0,
        'sort_order'  => (int) ($p['order'] ?? 0),
        'active'      => !empty($p['active']) ? 1 : 0,
        'data'        => json_col(rest($p, PLAN_COLS)),
    ];
}

// ---------------------------------------------------------------- comparison
function comparison_from_row(array $r): array
{
    return [
        'id'     => $r['id'],
        'label'  => $r['label'],
        'order'  => (int) $r['sort_order'],
        'values' => json_decode_col($r['values']),
    ];
}

function comparison_to_row(array $c, int $index = 0): array
{
    return [
        'id'         => str_field($c['id'] ?? '', 64) ?: new_id('row'),
        'label'      => str_field($c['label'] ?? '', 190),
        'sort_order' => (int) ($c['order'] ?? $index),
        'values'     => json_col($c['values'] ?? []),
    ];
}

// ---------------------------------------------------------------- faqs
function faq_from_row(array $r): array
{
    return [
        'id'       => $r['id'],
        'question' => $r['question'],
        'answer'   => $r['answer'],
        'group'    => $r['group_name'],
        'icon'     => $r['icon'],
        'color'    => $r['color'],
        'order'    => (int) $r['sort_order'],
        'active'   => b($r, 'active'),
    ];
}

function faq_to_row(array $f): array
{
    return [
        'id'         => str_field($f['id'] ?? '', 64) ?: new_id('faq'),
        'question'   => str_field($f['question'] ?? '', 500),
        'answer'     => str_field($f['answer'] ?? '', 5000),
        'group_name' => str_field($f['group'] ?? '', 64),
        'icon'       => str_field($f['icon'] ?? 'help', 64),
        'color'      => str_field($f['color'] ?? 'violet', 32),
        'sort_order' => (int) ($f['order'] ?? 0),
        'active'     => !empty($f['active']) ? 1 : 0,
    ];
}

// ---------------------------------------------------------------- testimonials
const TESTIMONIAL_COLS = ['id', 'order', 'active'];

function testimonial_from_row(array $r): array
{
    return array_merge(json_decode_col($r['data']), [
        'id'     => $r['id'],
        'order'  => (int) $r['sort_order'],
        'active' => b($r, 'active'),
    ]);
}

function testimonial_to_row(array $t): array
{
    return [
        'id'         => str_field($t['id'] ?? '', 64) ?: new_id('tst'),
        'sort_order' => (int) ($t['order'] ?? 0),
        'active'     => array_key_exists('active', $t) ? (!empty($t['active']) ? 1 : 0) : 1,
        'data'       => json_col(rest($t, TESTIMONIAL_COLS)),
    ];
}

// ---------------------------------------------------------------- enquiries
const ENQUIRY_COLS = [
    'id', 'owner', 'business', 'mobile', 'whatsapp', 'email', 'categoryId', 'city', 'state',
    'plan', 'service', 'budget', 'goal', 'status', 'assignedTo', 'source', 'routedTo',
    'routedTeam', 'message', 'createdAt',
];

function enquiry_from_row(array $r): array
{
    return array_merge(json_decode_col($r['data'] ?? ''), [
        'id'         => $r['id'],
        'owner'      => $r['owner'],
        'business'   => $r['business'],
        'mobile'     => $r['mobile'],
        'whatsapp'   => $r['whatsapp'],
        'email'      => $r['email'],
        'categoryId' => $r['category_id'],
        'city'       => $r['city'],
        'state'      => $r['state'],
        'plan'       => $r['plan'],
        'service'    => $r['service'],
        'budget'     => $r['budget'],
        'goal'       => $r['goal'],
        'status'     => $r['status'],
        'assignedTo' => $r['assigned_to'],
        'source'     => $r['source'],
        'routedTo'   => $r['routed_to'],
        'routedTeam' => $r['routed_team'],
        'message'    => (string) ($r['message'] ?? ''),
        'createdAt'  => str_replace(' ', 'T', (string) $r['created_at']),
    ]);
}

function enquiry_to_row(array $e): array
{
    $created = str_field($e['createdAt'] ?? '', 40);
    $ts = $created !== '' ? strtotime($created) : false;
    return [
        'id'          => str_field($e['id'] ?? '', 40) ?: ('ENQ-' . date('Y') . '-' . random_int(10000, 99999)),
        'owner'       => str_field($e['owner'] ?? '', 190),
        'business'    => str_field($e['business'] ?? '', 190),
        'mobile'      => digits($e['mobile'] ?? ''),
        'whatsapp'    => digits($e['whatsapp'] ?? ''),
        'email'       => str_field($e['email'] ?? '', 190),
        'category_id' => str_field($e['categoryId'] ?? '', 64),
        'city'        => str_field($e['city'] ?? '', 120),
        'state'       => str_field($e['state'] ?? '', 120),
        'plan'        => str_field($e['plan'] ?? '', 190),
        'service'     => str_field($e['service'] ?? '', 190),
        'budget'      => str_field($e['budget'] ?? '', 120),
        'goal'        => str_field($e['goal'] ?? '', 190),
        'status'      => str_field($e['status'] ?? 'New', 48),
        'assigned_to' => str_field($e['assignedTo'] ?? 'Unassigned', 120),
        'source'      => str_field($e['source'] ?? 'Website', 190),
        'routed_to'   => digits($e['routedTo'] ?? ''),
        'routed_team' => str_field($e['routedTeam'] ?? '', 64),
        'message'     => str_field($e['message'] ?? '', 5000),
        'data'        => json_col(rest($e, ENQUIRY_COLS)),
        'created_at'  => date('Y-m-d H:i:s', $ts ?: time()),
    ];
}

// ---------------------------------------------------------------- generic write
/** INSERT ... ON DUPLICATE KEY UPDATE for an associative row. */
function upsert(string $table, array $row): void
{
    $cols = array_keys($row);
    $place = implode(', ', array_map(fn($c) => ':' . $c, $cols));
    $names = implode(', ', array_map(fn($c) => "`$c`", $cols));
    $update = implode(', ', array_map(fn($c) => "`$c` = VALUES(`$c`)", array_filter($cols, fn($c) => $c !== 'id')));
    $sql = "INSERT INTO `$table` ($names) VALUES ($place)"
        . ($update !== '' ? " ON DUPLICATE KEY UPDATE $update" : '');
    db()->prepare($sql)->execute($row);
}

function delete_row(string $table, string $id): void
{
    db()->prepare("DELETE FROM `$table` WHERE `id` = ?")->execute([$id]);
}

// ---------------------------------------------------------------- settings
function get_setting(string $key, $default = null)
{
    $stmt = db()->prepare('SELECT v FROM settings WHERE k = ? LIMIT 1');
    $stmt->execute([$key]);
    $v = $stmt->fetchColumn();
    if ($v === false) {
        return $default;
    }
    $decoded = json_decode((string) $v, true);
    return $decoded === null ? $default : $decoded;
}

function put_setting(string $key, $value): void
{
    upsert('settings', ['k' => $key, 'v' => json_col($value)]);
}

// ---------------------------------------------------------------- readers
function all_categories(): array
{
    $rows = db()->query('SELECT * FROM categories ORDER BY sort_order, name')->fetchAll();
    return array_map('category_from_row', $rows);
}

function all_services(): array
{
    $rows = db()->query('SELECT * FROM services ORDER BY sort_order, name')->fetchAll();
    return array_map('service_from_row', $rows);
}

function all_plans(): array
{
    $rows = db()->query('SELECT * FROM plans ORDER BY sort_order')->fetchAll();
    return array_map('plan_from_row', $rows);
}

function all_comparison(): array
{
    $rows = db()->query('SELECT * FROM comparison_rows ORDER BY sort_order')->fetchAll();
    return array_map('comparison_from_row', $rows);
}

function all_faqs(): array
{
    $rows = db()->query('SELECT * FROM faqs ORDER BY sort_order')->fetchAll();
    return array_map('faq_from_row', $rows);
}

function all_testimonials(): array
{
    $rows = db()->query('SELECT * FROM testimonials ORDER BY sort_order')->fetchAll();
    return array_map('testimonial_from_row', $rows);
}

function all_enquiries(int $limit = 500): array
{
    $stmt = db()->prepare('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT ?');
    $stmt->bindValue(1, $limit, PDO::PARAM_INT);
    $stmt->execute();
    return array_map('enquiry_from_row', $stmt->fetchAll());
}
