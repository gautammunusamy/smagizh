/**
 * Exports the content in src/data/seed.js to api/seed.json.
 *
 * api/install.php imports that file into MySQL, so the 17 categories and their
 * 216 subcategories never have to be re-typed as SQL. Re-run this only if the
 * seed file changes AND the database has not been populated yet — once the site
 * is live, MySQL is the source of truth and this file is just the first-run
 * content.
 *
 *   node scripts/export-seed.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const seed = await import(new URL('../src/data/seed.js', import.meta.url))

const payload = {
  settings: seed.SITE,
  categoryGroups: seed.CATEGORY_GROUPS,
  teams: seed.TEAMS,
  categories: seed.CATEGORIES,
  services: seed.SERVICES,
  plans: seed.PLANS,
  comparison: seed.COMPARISON,
  faqGroups: seed.FAQ_GROUPS,
  faqs: seed.FAQS,
  testimonials: seed.TESTIMONIALS,
  trialPoints: seed.TRIAL_POINTS,
  nextSteps: seed.NEXT_STEPS,
}

const out = resolve(root, 'api/seed.json')
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(payload, null, 2), 'utf8')

const subs = payload.categories.reduce((n, c) => n + (c.subcategories?.length || 0), 0)
console.log(`api/seed.json written`)
console.log(
  `  ${payload.categories.length} categories (${subs} subcategories), ` +
    `${payload.services.length} services, ${payload.plans.length} plans, ` +
    `${payload.comparison.length} comparison rows, ${payload.faqs.length} FAQs, ` +
    `${payload.testimonials.length} testimonials`,
)
