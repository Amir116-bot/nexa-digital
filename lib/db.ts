import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database | null {
  if (dbInstance) return dbInstance;
  try {
    const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), "db", "nexa.sqlite");
    const isNew = !fs.existsSync(/* turbopackIgnore: true */ DB_PATH);
    const db = new Database(DB_PATH, { timeout: 5000 });
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    const schemaPath = path.join(process.cwd(), "db", "schema.sql");
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf-8");
      try {
        db.exec(schema);
      } catch (e) {
        // Ignored on read-only serverless filesystems
      }
    }

    if (isNew) {
      import("../scripts/seed").then((m) => m.seed(db)).catch(() => {});
    }
    dbInstance = db;
    return dbInstance;
  } catch (err) {
    console.warn("SQLite database file not accessible (running on Vercel Serverless environment):", err);
    return null;
  }
}

// Safe proxy wrapper for backward compatibility across all route handlers
export const db = new Proxy({} as Database.Database, {
  get(_target, prop) {
    const instance = getDb();
    if (!instance) {
      return () => ({
        get: () => undefined,
        all: () => [],
        run: () => ({ lastInsertRowid: 1 }),
      });
    }
    const value = (instance as any)[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export function getSetting(key: string, fallback = ""): string {
  try {
    const instance = getDb();
    if (instance) {
      const row = instance.prepare("SELECT value FROM site_settings WHERE key = ?").get(key) as
        | { value: string }
        | undefined;
      if (row?.value) return row.value;
    }
  } catch {}
  return fallback;
}

export function getAllSettings(): Record<string, string> {
  const defaultSettings: Record<string, string> = {
    site_name: "Nexa Digital",
    tagline_ar: "نحوّل أفكارك إلى تجارب رقمية ناجحة",
    tagline_en: "We turn your ideas into successful digital experiences",
    email: "dnexa99@gmail.com",
    phone: "+213795329388",
    whatsapp: "+213795329388",
    whatsapp_enabled: "true",
    address_ar: "الجزائر",
    address_en: "Algeria",
    instagram: "https://www.instagram.com/nexa_dig?stkn=bzJncW9zaDUxMHQ1",
    facebook: "",
    tiktok: "",
    linkedin: "",
    telegram: "",
    content_service_enabled: "false",
    default_locale: "ar",
    dark_mode_enabled: "false",
    meta_title_ar: "Nexa Digital — وكالة رقمية",
    meta_title_en: "Nexa Digital — Digital Agency",
    meta_description_ar: "نحوّل أفكارك إلى تجارب رقمية ناجحة: تصميم مواقع، تطوير تطبيقات، وهوية بصرية.",
    meta_description_en: "We turn your ideas into digital experiences: websites, apps, and brand identity.",
    google_analytics_id: "",
    primary_color: "#0B1E3F",
    secondary_color: "#5B2EBD",
    accent_color: "#22D3C6",
  };
  try {
    const instance = getDb();
    if (instance) {
      const rows = instance.prepare("SELECT key, value FROM site_settings").all() as {
        key: string;
        value: string;
      }[];
      if (rows && rows.length > 0) {
        return { ...defaultSettings, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
      }
    }
  } catch {}
  return defaultSettings;
}

export function setSetting(key: string, value: string) {
  try {
    const instance = getDb();
    if (instance) {
      instance.prepare(
        `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`
      ).run(key, value);
    }
  } catch {}
}
