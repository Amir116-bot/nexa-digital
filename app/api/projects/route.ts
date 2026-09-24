import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiGuard";
import { z } from "zod";

const schema = z.object({
  title_ar: z.string().min(1), title_en: z.string().min(1),
  type_ar: z.string().nullable().optional(), type_en: z.string().nullable().optional(),
  desc_ar: z.string().nullable().optional(), desc_en: z.string().nullable().optional(),
  cover_image: z.string().nullable().optional(),
  gallery: z.array(z.string()).default([]),
  project_url: z.string().nullable().optional(),
  service_id: z.number().int().nullable().optional(),
  is_demo: z.boolean().default(true),
  status: z.enum(["published", "hidden"]).default("hidden"),
  display_order: z.number().int().default(0),
});

export async function GET() {
  const rows = db.prepare(`SELECT * FROM projects ORDER BY display_order ASC, id DESC`).all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid", details: parsed.error.flatten() }, { status: 400 });
  const d = parsed.data;

  const result = db.prepare(`
    INSERT INTO projects (title_ar, title_en, type_ar, type_en, desc_ar, desc_en, cover_image, gallery, project_url, service_id, is_demo, status, display_order)
    VALUES (@title_ar, @title_en, @type_ar, @type_en, @desc_ar, @desc_en, @cover_image, @gallery, @project_url, @service_id, @is_demo, @status, @display_order)
  `).run({
    ...d,
    type_ar: d.type_ar ?? null, type_en: d.type_en ?? null,
    desc_ar: d.desc_ar ?? null, desc_en: d.desc_en ?? null,
    cover_image: d.cover_image ?? null, project_url: d.project_url ?? null,
    service_id: d.service_id ?? null,
    gallery: JSON.stringify(d.gallery),
    is_demo: d.is_demo ? 1 : 0,
  });
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
