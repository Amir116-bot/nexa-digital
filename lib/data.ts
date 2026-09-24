import { db, getAllSettings } from "./db";

export type Service = {
  id: number; slug: string; name_ar: string; name_en: string;
  desc_ar: string; desc_en: string; features_ar: string; features_en: string;
  category: string; icon: string; image: string | null; price: string | null;
  duration: string | null; status: string; display_order: number;
};

export type Project = {
  id: number; title_ar: string; title_en: string; type_ar: string | null; type_en: string | null;
  desc_ar: string | null; desc_en: string | null; cover_image: string | null; gallery: string;
  project_url: string | null; service_id: number | null; is_demo: number; status: string; display_order: number;
};

export type Faq = {
  id: number; question_ar: string; question_en: string; answer_ar: string; answer_en: string;
  service_id: number | null; status: string; display_order: number;
};

export function getPublishedServices(): Service[] {
  const contentEnabled = getAllSettings().content_service_enabled === "true";
  const rows = db
    .prepare(`SELECT * FROM services WHERE status = 'published' ORDER BY display_order ASC, id ASC`)
    .all() as Service[];
  return rows.filter((s) => (s.slug === "content-writing" ? contentEnabled : true));
}

export function getServiceBySlug(slug: string): Service | undefined {
  return db.prepare(`SELECT * FROM services WHERE slug = ?`).get(slug) as Service | undefined;
}

export function getPublishedProjects(limit?: number): Project[] {
  const q = `SELECT * FROM projects WHERE status = 'published' ORDER BY display_order ASC, id DESC` + (limit ? ` LIMIT ${limit}` : "");
  return db.prepare(q).all() as Project[];
}

export function getPublishedFaqs(): Faq[] {
  return db.prepare(`SELECT * FROM faqs WHERE status = 'published' ORDER BY display_order ASC, id ASC`).all() as Faq[];
}

export function getSiteSettings() {
  return getAllSettings();
}
