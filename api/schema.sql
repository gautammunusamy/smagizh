-- Smagizh Marketing - database schema
--
-- Created automatically by api/install.php. You can also paste this into
-- hPanel -> Databases -> phpMyAdmin -> SQL if you prefer to build the tables
-- by hand before running the installer.
--
-- Fields the site filters, sorts or routes on are real columns. The remaining
-- per-item content (subcategory lists, feature lists, page copy) is stored as
-- JSON in the `data` column, which keeps the admin panel free to add fields
-- without a migration.

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `username`      VARCHAR(64)  NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `name`          VARCHAR(120) NOT NULL DEFAULT 'Admin',
  `last_login_at` DATETIME NULL,
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_admin_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site settings, one JSON value per key (`site`, `trialPoints`, ...).
CREATE TABLE IF NOT EXISTS `settings` (
  `k`          VARCHAR(64) PRIMARY KEY,
  `v`          LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categories` (
  `id`         VARCHAR(64) PRIMARY KEY,
  `slug`       VARCHAR(160) NOT NULL,
  `name`       VARCHAR(190) NOT NULL,
  `group_id`   VARCHAR(64)  NOT NULL DEFAULT '',
  `icon`       VARCHAR(64)  NOT NULL DEFAULT 'box',
  `color`      VARCHAR(32)  NOT NULL DEFAULT 'violet',
  `image`      LONGTEXT NULL,
  `banner`     LONGTEXT NULL,
  `team`       VARCHAR(64)  NOT NULL DEFAULT 'Default',
  `whatsapp`   VARCHAR(24)  NOT NULL DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 0,
  `active`     TINYINT(1) NOT NULL DEFAULT 1,
  `data`       LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_cat_slug` (`slug`),
  KEY `idx_cat_sort` (`sort_order`),
  KEY `idx_cat_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `services` (
  `id`         VARCHAR(64) PRIMARY KEY,
  `slug`       VARCHAR(160) NOT NULL,
  `name`       VARCHAR(190) NOT NULL,
  `icon`       VARCHAR(64)  NOT NULL DEFAULT 'megaphone',
  `color`      VARCHAR(32)  NOT NULL DEFAULT 'violet',
  `image`      LONGTEXT NULL,
  `whatsapp`   VARCHAR(24)  NOT NULL DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 0,
  `active`     TINYINT(1) NOT NULL DEFAULT 1,
  `data`       LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_svc_slug` (`slug`),
  KEY `idx_svc_sort` (`sort_order`),
  KEY `idx_svc_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `plans` (
  `id`          VARCHAR(64) PRIMARY KEY,
  `name`        VARCHAR(190) NOT NULL,
  `price`       DECIMAL(10,2) NOT NULL DEFAULT 0,
  `is_free`     TINYINT(1) NOT NULL DEFAULT 0,
  `recommended` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order`  INT NOT NULL DEFAULT 0,
  `active`      TINYINT(1) NOT NULL DEFAULT 1,
  `data`        LONGTEXT NOT NULL,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_plan_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rows of the "Find the right support" comparison table.
CREATE TABLE IF NOT EXISTS `comparison_rows` (
  `id`         VARCHAR(64) PRIMARY KEY,
  `label`      VARCHAR(190) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `values`     LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_cmp_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `faqs` (
  `id`         VARCHAR(64) PRIMARY KEY,
  `question`   VARCHAR(500) NOT NULL,
  `answer`     TEXT NOT NULL,
  `group_name` VARCHAR(64) NOT NULL DEFAULT '',
  `icon`       VARCHAR(64) NOT NULL DEFAULT 'help',
  `color`      VARCHAR(32) NOT NULL DEFAULT 'violet',
  `sort_order` INT NOT NULL DEFAULT 0,
  `active`     TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_faq_sort` (`sort_order`),
  KEY `idx_faq_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id`         VARCHAR(64) PRIMARY KEY,
  `sort_order` INT NOT NULL DEFAULT 0,
  `active`     TINYINT(1) NOT NULL DEFAULT 1,
  `data`       LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_tst_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enquiries submitted from the public site.
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id`          VARCHAR(40) PRIMARY KEY,
  `owner`       VARCHAR(190) NOT NULL DEFAULT '',
  `business`    VARCHAR(190) NOT NULL DEFAULT '',
  `mobile`      VARCHAR(24)  NOT NULL DEFAULT '',
  `whatsapp`    VARCHAR(24)  NOT NULL DEFAULT '',
  `email`       VARCHAR(190) NOT NULL DEFAULT '',
  `category_id` VARCHAR(64)  NOT NULL DEFAULT '',
  `city`        VARCHAR(120) NOT NULL DEFAULT '',
  `state`       VARCHAR(120) NOT NULL DEFAULT '',
  `plan`        VARCHAR(190) NOT NULL DEFAULT '',
  `service`     VARCHAR(190) NOT NULL DEFAULT '',
  `budget`      VARCHAR(120) NOT NULL DEFAULT '',
  `goal`        VARCHAR(190) NOT NULL DEFAULT '',
  `status`      VARCHAR(48)  NOT NULL DEFAULT 'New',
  `assigned_to` VARCHAR(120) NOT NULL DEFAULT 'Unassigned',
  `source`      VARCHAR(190) NOT NULL DEFAULT 'Website',
  `routed_to`   VARCHAR(24)  NOT NULL DEFAULT '',
  `routed_team` VARCHAR(64)  NOT NULL DEFAULT '',
  `message`     TEXT NULL,
  `data`        LONGTEXT NULL,
  `created_at`  DATETIME NOT NULL,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_enq_created` (`created_at`),
  KEY `idx_enq_status` (`status`),
  KEY `idx_enq_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Razorpay payments made from the Plans section.
CREATE TABLE IF NOT EXISTS `payments` (
  `id`           VARCHAR(40) PRIMARY KEY,
  `plan_id`      VARCHAR(64)  NOT NULL DEFAULT '',
  `plan_name`    VARCHAR(190) NOT NULL DEFAULT '',
  `billing`      VARCHAR(16)  NOT NULL DEFAULT 'monthly',
  `months`       INT          NOT NULL DEFAULT 1,
  `amount_paise` BIGINT       NOT NULL DEFAULT 0,
  `currency`     VARCHAR(8)   NOT NULL DEFAULT 'INR',
  `status`       VARCHAR(24)  NOT NULL DEFAULT 'created',
  `order_id`     VARCHAR(64)  NOT NULL DEFAULT '',
  `payment_id`   VARCHAR(64)  NOT NULL DEFAULT '',
  `method`       VARCHAR(32)  NOT NULL DEFAULT '',
  `name`         VARCHAR(190) NOT NULL DEFAULT '',
  `email`        VARCHAR(190) NOT NULL DEFAULT '',
  `contact`      VARCHAR(24)  NOT NULL DEFAULT '',
  `business`     VARCHAR(190) NOT NULL DEFAULT '',
  `notes`        VARCHAR(255) NOT NULL DEFAULT '',
  `ip_hash`      CHAR(64)     NOT NULL DEFAULT '',
  `created_at`   DATETIME     NOT NULL,
  `paid_at`      DATETIME     NULL,
  `updated_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_pay_order` (`order_id`),
  KEY `idx_pay_created` (`created_at`),
  KEY `idx_pay_status` (`status`),
  KEY `idx_pay_ip` (`ip_hash`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
