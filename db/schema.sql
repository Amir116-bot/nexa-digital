-- Nexa Digital — schema.sql
-- SQLite by default (works instantly, zero setup). For production, port to
-- PostgreSQL/Supabase: types map almost 1:1 (TEXT->text, INTEGER->integer/boolean,
-- DATETIME->timestamptz). See README "Moving to Supabase/PostgreSQL".

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  desc_ar TEXT NOT NULL,
  desc_en TEXT NOT NULL,
  features_ar TEXT NOT NULL DEFAULT '[]', -- JSON array
  features_en TEXT NOT NULL DEFAULT '[]', -- JSON array
  category TEXT NOT NULL DEFAULT 'development',
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  image TEXT,
  price TEXT,
  duration TEXT,
  status TEXT NOT NULL DEFAULT 'published', -- published | hidden
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  type_ar TEXT,
  type_en TEXT,
  desc_ar TEXT,
  desc_en TEXT,
  cover_image TEXT,
  gallery TEXT DEFAULT '[]', -- JSON array of image urls
  project_url TEXT,
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  is_demo INTEGER NOT NULL DEFAULT 1, -- 1 = demo/placeholder project, 0 = real
  status TEXT NOT NULL DEFAULT 'published',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_ar TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'published',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  service_type TEXT,
  description TEXT NOT NULL,
  budget TEXT,
  deadline TEXT,
  preferred_contact TEXT DEFAULT 'email',
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new|reviewing|contacted|in_progress|completed|cancelled
  internal_notes TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', -- new|read|replied
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_name TEXT NOT NULL,
  role_ar TEXT,
  role_en TEXT,
  quote_ar TEXT NOT NULL,
  quote_en TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_request_id INTEGER REFERENCES quote_requests(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- key/value settings store (site name, colors, contact info, SEO, feature flags...)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
