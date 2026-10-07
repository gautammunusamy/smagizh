# Deploying to Hostinger (hPanel)

The site is now two pieces that live on the same domain:

| Piece | Where it goes | What it is |
| --- | --- | --- |
| React build | `public_html/` (contents of `dist/`) | the website and the admin screens |
| PHP API | `public_html/api/` | reads and writes MySQL |
| Uploads | `public_html/uploads/` | images uploaded in the admin panel |

Because both share one domain, the admin session cookie works with no CORS
setup, and the site calls `/api/...` directly.

---

## 1. Create the database

**hPanel → Databases → MySQL Databases**

1. Create a database, e.g. `smagizh`.
2. Create a user and give it **all privileges** on that database.
3. Copy the three values Hostinger shows you — it prefixes them, so they look
   like `u123456789_smagizh`:
   - database name
   - database user
   - the password you chose

## 2. Build the front end

On your machine:

```bash
npm install
```

```bash
npm run build
```

That produces `dist/`.

## 3. Upload

**hPanel → Files → File Manager**, open `public_html`:

1. Upload **the contents of `dist/`** into `public_html` (not the `dist` folder
   itself). Keep `.htaccess` — enable *Show hidden files* in File Manager
   settings or it gets skipped, and deep links like `/categories/bike-rental`
   will 404 on refresh.
2. Upload the whole **`api/`** folder into `public_html`.
3. Create an empty **`uploads/`** folder in `public_html` and set its
   permissions to **755**.

## 4. Configure the API

In `public_html/api/`:

1. Rename `config.sample.php` to **`config.php`**.
2. Edit it and fill in:

```php
'db_name' => 'u123456789_smagizh',
'db_user' => 'u123456789_smagizh',
'db_pass' => 'the password you chose',

'admin_username' => 'smagizh',
'admin_password' => 'pick a strong password',

'install_token'  => 'any-long-random-string-you-invent',
```

`db_host` stays `localhost` on Hostinger.

## 5. Run the installer once

Visit, replacing the token with the one you just set:

```
https://smagizh.com/api/install.php?token=any-long-random-string-you-invent
```

You should see it create the tables and import the content:

```
Tables created / verified.
categories       imported 17 rows
services         imported 9 rows
plans            imported 4 rows
comparison_rows  imported 16 rows
faqs             imported 16 rows
testimonials     imported 3 rows
settings         imported
(216 subcategories stored inside the category rows)
Admin user 'smagizh' created.
uploads/ ready.
Done. Sign in at /admin
```

**Then delete `public_html/api/install.php`.** It is the one file that can
re-import content, so it should not stay on a live site.

## 5b. Turn on Razorpay payments (Plans section)

Online payment is **off** until the keys are set — the Plans buttons simply open
the enquiry form instead, so the site works either way.

1. Razorpay dashboard → **Settings → API Keys** → generate a key pair.
2. Add the two values to `public_html/api/config.php`:

```php
'razorpay_key_id'     => 'rzp_live_xxxxxxxxxxxx',
'razorpay_key_secret' => 'the secret shown once when you generate the key',
```

3. Re-run the installer once (step 5) so the new `payments` table is created,
   then delete `install.php` again.
4. Open the site → **Plans** → *Choose Monthly*. The Razorpay window should open
   with the right amount.

**The key secret must only ever live in `api/config.php`.** That file is blocked
from the web by `api/.htaccess`, is excluded from the deploy zip and is never
sent to the browser — the React build only receives the public `key_id` at
runtime. Never paste the secret into the admin panel, an email or a chat.

What gets charged:

| Button | Amount |
| --- | --- |
| Choose Monthly | the 5%-off monthly fee, once (Basic ₹4,749.05) |
| Choose Annual | 12 × the 20%-off monthly fee, upfront (Basic ₹47,990.40) |

Amounts are always calculated **on the server** from the plan price in the
database and the discounts in Admin → Plans, so a visitor cannot change the
price. Change a plan price in the admin and the charged amount follows.

Optional but recommended — **webhook** (records a payment even if the customer
closes the browser at the wrong moment):

1. Razorpay dashboard → **Settings → Webhooks → Add New Webhook**
2. URL: `https://smagizh.com/api/payment.php?action=webhook`
3. Active events: `payment.captured` and `payment.failed`
4. Put the webhook secret into `config.php` as `razorpay_webhook_secret`.

Payments appear in **Admin → Payments**, with the Razorpay payment id for each.

## 6. Check it

1. Open `https://smagizh.com` — the site should load its content from the API.
2. Open `https://smagizh.com/admin` and sign in.
3. Change something small (e.g. a category name), then open the public site
   **in a different browser or on your phone**. The change must be visible
   there too — that is the whole point of this backend, and it is the one test
   worth doing carefully.
4. Submit an enquiry from the site and confirm it appears in **Admin →
   Enquiries**.
5. If payments are on: pay for the cheapest plan once with a real card or UPI,
   confirm **Admin → Payments** shows it as *Paid* with the Razorpay payment id,
   then refund it from the Razorpay dashboard. This is the only way to test a
   live key end to end — live keys cannot take test payments.

---

## Updating the site later

**Front-end change** (layout, copy in code): run `npm run build` and re-upload
the contents of `dist/`. Do **not** delete `api/` or `uploads/`.

**Content change** (categories, services, plans, FAQs, settings): do it in the
admin panel. No build, no upload.

## Changing the admin password

**Admin → Settings → Change password.** It is stored as a bcrypt hash in
MySQL; the value in `config.php` is only used to create the first account.

## If something goes wrong

| Symptom | Cause |
| --- | --- |
| "Backend not configured" | `api/config.php` is missing — you left it as `config.sample.php` |
| "Cannot connect to the database" | wrong `db_name` / `db_user` / `db_pass`, or the user has no privileges on that database |
| Site loads but has no content | the installer has not been run yet |
| "Server returned an unexpected response" | a PHP error — check **hPanel → Advanced → PHP Error Log** |
| Image upload fails | `uploads/` missing or not writable — create it and set 755 |
| Admin logs out on refresh | PHP sessions cannot write — check the error log |
| `/categories/bike-rental` 404s on refresh | `.htaccess` was not uploaded |

## Backups

The content now lives in MySQL, not in the code. Take a backup before any big
change: **hPanel → Databases → phpMyAdmin → Export → Go**. That one `.sql` file
restores every category, plan, FAQ and enquiry.

## A note on security

- The admin password is a bcrypt hash in the database and is verified
  server-side; it is no longer in the JavaScript bundle.
- The session cookie is HttpOnly, and Secure whenever the site is on HTTPS.
- Every write endpoint requires that session, so content cannot be changed
  without signing in.
- Login attempts are rate-limited after 5 failures.
- `config.php`, `schema.sql` and `seed.json` are blocked from the web by
  `api/.htaccess`, and `uploads/` cannot execute PHP.
