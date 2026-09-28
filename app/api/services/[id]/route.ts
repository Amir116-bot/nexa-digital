import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/apiGuard";
import { z } from "zod";

const updateSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/).optional(),
  name_ar: z.string().min(1).optional(), name_en: z.string().min(1).optional(),
  desc_ar: z.string().min(1).optional(), desc_en: z.string().min(1).optional(),
  features_ar: z.array(z.string()).optional(),
  features_en: z.array(z.string()).optional(),
  category: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  image: z.string().nullable().optional(),
  price: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  status: z.enum(["published", "hidden"]).optional(),
  display_order: z.number().int().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (supabase) {
    try {
      const { data } = await supabase.from("services").select("*").eq("id", id).single();
      if (data) return NextResponse.json(data);
    } catch {}
  }
  try {
    const row = db.prepare(`SELECT * FROM services WHERE id = ?`).get(id);
    if (row) return NextResponse.json(row);
  } catch {}
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Authentication disabled for development - re-enable in production
  // const { response } = await requireAdmin();
  // if (response) return response;
  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid", details: parsed.error.flatten() }, { status: 400 });

  const d = parsed.data;

  if (supabase) {
    try {
      const updateData: any = { updated_at: new Date().toISOString(), ...d };
      if (d.features_ar) updateData.features_ar = JSON.stringify(d.features_ar);
      if (d.features_en) updateData.features_en = JSON.stringify(d.features_en);
      await supabase.from("services").update(updateData).eq("id", id);
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.warn("Supabase service update error:", e);
    }
  }

  try {
    const existing = db.prepare(`SELECT * FROM services WHERE id = ?`).get(id) as any;
    if (existing) {
      const merged = {
        ...existing,
        ...d,
        features_ar: d.features_ar ? JSON.stringify(d.features_ar) : existing.features_ar,
        features_en: d.features_en ? JSON.stringify(d.features_en) : existing.features_en,
      };
      db.prepare(`
        UPDATE services SET slug=@slug, name_ar=@name_ar, name_en=@name_en, desc_ar=@desc_ar, desc_en=@desc_en,
        features_ar=@features_ar, features_en=@features_en, category=@category, icon=@icon, image=@image,
        price=@price, duration=@duration, status=@status, display_order=@display_order, updated_at=CURRENT_TIMESTAMP
        WHERE id=@id
      `).run({ ...merged, id });
    }
  } catch {}

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Authentication disabled for development - re-enable in production
  // const { response } = await requireAdmin();
  // if (response) return response;
  const { id } = await params;

  if (supabase) {
    try {
      await supabase.from("services").delete().eq("id", id);
      return NextResponse.json({ ok: true });
    } catch {}
  }

  try {
    db.prepare(`DELETE FROM services WHERE id = ?`).run(id);
  } catch {}

  return NextResponse.json({ ok: true });
}
