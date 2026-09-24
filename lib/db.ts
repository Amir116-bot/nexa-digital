import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// SQLite is used here so the project runs immediately with zero setup.
// To move to Supabase/PostgreSQL in production, see README "Moving to Supabase".
const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), "db", "nexa.sqlite");

const isNew = !fs.existsSync(/* turbopackIgnore: true */ DB_PATH);

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const schema = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf-8");
db.exec(schema);

if (isNew) {
  // Lazy-seed on first run
  import("../scripts/seed").then((m) => m.seed(db)).catch(() => {});
}

export function getSetting(key: string, fallback = ""): string {
  const row = db.prepare("SELECT value FROM site_settings WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? fallback;
}

export function getAllSettings(): Record<string, string> {
  const rows = db.prepare("SELECT key, value FROM site_settings").all() as {
    key: string;
    value: string;
  }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function setSetting(key: string, value: string) {
  db.prepare(
    `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`
  ).run(key, value);
}
