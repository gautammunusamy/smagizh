# Smagizh Marketing

Digital marketing & lead-generation website for rental businesses, with a built-in Admin Panel.
Built with **React 18 + Vite + Tailwind CSS + React Router**.

The whole public site is driven by data the Admin Panel owns — 17 rental categories with 216
subcategories, category-wise WhatsApp routing, services, plans, FAQs and site settings. Nothing on the
user side is hard-coded.

Content sources: rental categories and subcategories come from the client's *MujoRentals Master
Catalog* (names used exactly as supplied); page layouts, copy, services, plans and FAQs follow the
client's correction reference deck.

---

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173

Production build:

```bash
npm run build
```

```bash
npm run preview
```

## Admin Panel

- URL: `/admin/login`
- The username and the first password are set in `api/config.php` before the
  installer runs (see [DEPLOY.md](DEPLOY.md)), and the password is changed from
  Admin → Settings afterwards. Credentials are never stored in this repository.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home — hero + category panel, grouped categories, services, why choose us, how it works, enquiry flow, plans, testimonials, FAQ, CTA |
| `/categories` | All 17 categories in 4 groups, search (also matches subcategories) + group filter |
| `/categories/:slug` | Category page — hero/banner, selectable rental types, key features, channels, description, benefits, plans, lead form → WhatsApp, related services, contact |
| `/services` | 9 digital marketing services |
| `/services/:slug` | Service page — description, key features, benefits, how it works, categories, enquiry → WhatsApp, related services, contact |
| `/plans` | Free/Basic/Business/Premium with monthly & annual pricing, comparison table, 16 FAQs |
| `/how-it-works` | 8-step growth journey and the WhatsApp enquiry flow |
| `/about` | Who we are, what we do, consultation form |
| `/contact` | Contact details, free-consultation date/time picker and form |
| `/admin/login` | Admin sign-in |
| `/admin` | Dashboard — counts, category-wise enquiry chart, recent enquiries, routing status |
| `/admin/categories` | Categories: name, group, icon + colour, image, banner, page content, WhatsApp number, order, status — and full subcategory management (add, rename, icon, colour, image, hide, reorder) |
| `/admin/services` | Services: name, tag, icon + colour, image, descriptions, key features, benefits, WhatsApp number, order, status |
| `/admin/plans` | Plans, monthly/annual discount %, and the comparison table |
| `/admin/faqs` | Add / edit / delete / activate / reorder FAQs (icon, colour, group) |
| `/admin/enquiries` | All enquiries with filters, status updates, WhatsApp reply and CSV export |
| `/admin/whatsapp-routing` | Category ⇄ team ⇄ WhatsApp number, default fallback number, per-row test link |
| `/admin/settings` | Business identity, contact details, default WhatsApp number, social links, brand preview |

## WhatsApp routing rule

Implemented in [`src/utils/whatsapp.js`](src/utils/whatsapp.js):

1. If the selected category has its own WhatsApp number → the enquiry goes there.
2. Otherwise, if the enquiry is about a service that has its own number → it goes there.
3. Otherwise → the **default business number** from Admin → Settings / WhatsApp Routing.

The pre-filled message includes the customer's name, business, WhatsApp number, rental category, the
rental types (subcategories) they selected, plan, service, service area, inventory, budget, goal and
requirements — only the fields they filled in.

## Where the data lives

`src/data/seed.js` holds the initial content. On first load it is copied into `localStorage`
(`smagizh:*` keys) and from then on the Admin Panel is the source of truth — every change appears on the
public site immediately, with no code edits. `DATA_VERSION` in the seed makes browsers that hold older
demo content switch to the current catalog automatically (enquiries and edited settings are kept).

To wire this to a real backend, replace the `useState`/`localStorage` calls in
[`src/context/DataContext.jsx`](src/context/DataContext.jsx) with API calls; nothing else needs to change.
Admin → Settings → **Reset demo content** restores the original content.

## Branding

The client's approved Smagizh logo (S mark + multicolour wordmark + "Your Business Growth Partner") is
used in the header, mobile menu, footer, admin login, admin sidebar and favicon. The artwork lives in
`public/brand/` (transparent PNGs cut from the client file) and is rendered by
[`src/components/Logo.jsx`](src/components/Logo.jsx).

## Icons

All icons are line icons from one registry — [`src/components/AppIcon.jsx`](src/components/AppIcon.jsx)
(Tabler + Lucide, plus a few custom glyphs). Categories, subcategories, services, plans and FAQs store an
icon key and a colour, both picked in the Admin Panel; an uploaded image can replace any icon.

## Project structure

```
src/
  admin/        Admin Panel screens + shared admin form controls
  components/   Header, Footer, Logo, AppIcon (icon registry), cards, sections, forms, modals
  context/      DataContext (content + migration), AuthContext (admin session), EnquiryContext (enquiry modal)
  data/seed.js  17 categories / 216 subcategories, services, plans, comparison, FAQs, testimonials
  pages/        Public pages
  utils/        WhatsApp routing + message builder, formatting, storage
```

## Deploy

```bash
npm run build
```

The deployable site is the **`dist/`** folder — static files, no server runtime needed.

Preview the real build locally before uploading:

```bash
npm run preview
```

Because React Router uses real URLs, the host must serve `index.html` for any path that is not a file,
otherwise a refresh on `/categories/bike-rental` returns 404. The configs are already in the repo:

| Host | File | Notes |
| --- | --- | --- |
| Netlify | `netlify.toml` + `public/_redirects` | Drag-and-drop `dist/`, or connect the repo (build `npm run build`, publish `dist`) |
| Vercel | `vercel.json` | Framework preset "Vite" |
| cPanel / Apache | `public/.htaccess` (copied into `dist/`) | Upload the **contents** of `dist/` into `public_html`. Keep `.htaccess` — enable "show hidden files" in File Manager |
| Nginx | — | `location / { try_files $uri $uri/ /index.html; }` |

Serving from a sub-folder (e.g. `example.com/site/`) additionally needs `base: '/site/'` in
`vite.config.js` and a matching `RewriteBase` in `.htaccess`.

Before going live, set the real business details in **Admin → Settings** (default WhatsApp number,
phone, email, address) and the per-category numbers in **Admin → WhatsApp Routing**. Those live in the
browser's storage, so for a shared production site move the values into `src/data/seed.js` (or a
backend) so every visitor gets them.
