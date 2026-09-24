import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiGuard";
import { z } from "zod";

const schema = z.object({
  question_ar: z.string().min(1).optional(), question_en: z.string().min(1).optional(),
  answer_ar: z.string().min(1).optional(), answer_en: z.string().min(1).optional(),
  service_id: z.number().int().nullable().optional(),
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

  const existing = db.prepare(`SELECT * FROM faqs WHERE id = ?`).get(id) as any;
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const merged = { ...existing, ...parsed.data };
  db.prepare(`
    UPDATE faqs SET question_ar=@question_ar, question_en=@question_en, answer_ar=@answer_ar, answer_en=@answer_en,
    service_id=@service_id, status=@status, display_order=@display_order, updated_at=CURRENT_TIMESTAMP WHERE id=@id
  `).run({ ...merged, id });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;
  db.prepare(`DELETE FROM faqs WHERE id = ?`).run(id);
  return NextResponse.json({ ok: true });
}
