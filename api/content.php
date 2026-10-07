<?php
/**
 * Public content for the whole website - one request, no authentication.
 * GET /api/content.php
 */

declare(strict_types=1);
require __DIR__ . '/lib.php';
require __DIR__ . '/store.php';

apply_cors();
require_method('GET');

$isAdmin = current_admin() !== null;

$categories = all_categories();
$services   = all_services();
$plans      = all_plans();
$faqs       = all_faqs();
$testimonials = all_testimonials();

// Visitors only ever receive published content; the admin panel asks for
// everything so it can manage hidden items too.
if (!$isAdmin) {
    $onlyActive = static fn(array $list): array => array_values(array_filter($list, static fn($x) => !empty($x['active'])));
    $categories   = $onlyActive($categories);
    $services     = $onlyActive($services);
    $plans        = $onlyActive($plans);
    $faqs         = $onlyActive($faqs);
    $testimonials = $onlyActive($testimonials);

    // Hide the subcategories an admin has switched off.
    $categories = array_map(static function (array $c): array {
        if (!empty($c['subcategories']) && is_array($c['subcategories'])) {
            $c['subcategories'] = array_values(array_filter(
                $c['subcategories'],
                static fn($s) => !isset($s['active']) || $s['active']
            ));
        }
        return $c;
    }, $categories);
}

ok([
    'settings'     => get_setting('site', []),
    'categories'   => $categories,
    'services'     => $services,
    'plans'        => $plans,
    'comparison'   => all_comparison(),
    'faqs'         => $faqs,
    'testimonials' => $testimonials,
    'isAdmin'      => $isAdmin,
]);
