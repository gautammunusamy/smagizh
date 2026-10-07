<?php
/**
 * Copy this file to  config.php  and fill in the values from hPanel.
 * config.php is blocked from the web by api/.htaccess and must never be
 * committed to git.
 *
 * hPanel → Databases → Management → MySQL Databases:
 *   create a database + user, then copy the exact names below.
 *   Hostinger prefixes both, e.g. u123456789_smagizh.
 */

return [
    // ---- MySQL (hPanel → Databases → MySQL Databases) ----
    'db_host' => 'localhost',
    'db_port' => 3306,
    'db_name' => 'u000000000_smagizh',
    'db_user' => 'u000000000_smagizh',
    'db_pass' => 'YOUR_DATABASE_PASSWORD',

    // ---- First admin account, created by install.php ----
    // Change the password here BEFORE running install.php, or change it later
    // from Admin → Settings → Change password.
    'admin_username' => 'smagizh',
    'admin_password' => 'CHANGE-THIS-BEFORE-RUNNING-INSTALL',
    'admin_name'     => 'Smagizh Admin',

    // ---- One-time token that authorises install.php ----
    // Pick any long random string. install.php refuses to run without it.
    'install_token' => 'CHANGE_THIS_TO_A_LONG_RANDOM_STRING',

    // ---- Razorpay (hPanel is not involved - get these from the Razorpay
    //      dashboard -> Settings -> API Keys) ----
    // Leave the placeholders in place to keep online payment switched off:
    // the Plans buttons then fall back to the enquiry form.
    // NEVER copy these two values into the React code or share them.
    'razorpay_key_id'     => 'YOUR_RAZORPAY_KEY_ID',
    'razorpay_key_secret' => 'YOUR_RAZORPAY_KEY_SECRET',

    // Optional: Razorpay dashboard -> Settings -> Webhooks. Set the webhook URL
    // to https://your-site/api/payment.php?action=webhook and paste its secret
    // here so captured payments are recorded even if the browser closes early.
    'razorpay_webhook_secret' => '',

    // Only needed on local Windows PHP, which has no CA bundle. Leave empty
    // on Hostinger - the server already verifies TLS certificates.
    'curl_cainfo' => '',

    // ---- Extra origins allowed to call the API (local development only) ----
    // Leave empty in production: the site and API share one origin.
    'dev_origins' => [],
];
