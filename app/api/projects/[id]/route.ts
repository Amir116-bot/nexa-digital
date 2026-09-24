import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiGuard";
import { z } from "zod";

const schema = z.object({
  title_ar: z.string().min(1).optional(), title_en: z.string().min(1).optional(),
  type_ar: z.string().nullable().optional(), type_en: z.string().nullable().optional(),
  desc_ar: z.string().nullable().optional(), desc_en: z.string().nullable().optional(),
  cover_image: z.string().nullable().optional(),
  gallery: z.array(z.string()).optional(),
  project_url: z.string().nullable().optional(),
  service_id: z.number().int().nullable().optional(),
  is_demo: z.boolean().optional(),
  status: z.enum(["published", "hidden"]).optional(),
  display_order: z.number().int().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const existing = db.prepare(`SELECT * FROM projects WHERE id = ?`).get(id) as any;
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const d = parsed.data;
  const merged = {
    ...existing,
    ...d,
    gallery: d.gallery ? JSON.stringify(d.gallery) : existing.gallery,
    is_demo: d.is_demo === undefined ? existing.is_demo : d.is_demo ? 1 : 0,
  };

  db.prepare(`
    UPDATE projects SET title_ar=@title_ar, title_en=@title_en, type_ar=@type_ar, type_en=@type_en,
    desc_ar=@desc_ar, desc_en=@desc_en, cover_image=@cover_image, gallery=@gallery, project_url=@project_url,
    service_id=@service_id, is_demo=@is_demo, status=@status, display_order=@display_order, updated_at=CURRENT_TIMESTAMP
    WHERE id=@id
  `).run({ ...merged, id });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;
  db.prepare(`DELETE FROM projects WHERE id = ?`).run(id);
  return NextResponse.json({ ok: true });
}
