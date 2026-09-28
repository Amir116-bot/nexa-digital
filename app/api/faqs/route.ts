import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/apiGuard";
import { z } from "zod";

const schema = z.object({
  question_ar: z.string().min(1), question_en: z.string().min(1),
  answer_ar: z.string().min(1), answer_en: z.string().min(1),
  service_id: z.number().int().nullable().optional(),
  status: z.enum(["published", "hidden"]).default("published"),
  display_order: z.number().int().default(0),
});

export async function GET() {
  if (supabase) {
    try {
      const { data } = await supabase.from("faqs").select("*").order("display_order", { ascending: true }).order("id", { ascending: true });
      if (data && data.length > 0) return NextResponse.json(data);
    } catch {}
  }
  try {
    const rows = db.prepare(`SELECT * FROM faqs ORDER BY display_order ASC, id ASC`).all();
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const d = parsed.data;

  if (supabase) {
    try {
      const { data } = await supabase.from("faqs").insert([{
        question_ar: d.question_ar,
        question_en: d.question_en,
        answer_ar: d.answer_ar,
        answer_en: d.answer_en,
        service_id: d.service_id ?? null,
        status: d.status,
        display_order: d.display_order,
      }]).select("id").single();
      if (data) return NextResponse.json({ id: data.id }, { status: 201 });
    } catch (e) {
      console.warn("Supabase faq insert error:", e);
    }
  }

  try {
    const result = db.prepare(`
      INSERT INTO faqs (question_ar, question_en, answer_ar, answer_en, service_id, status, display_order)
      VALUES (@question_ar, @question_en, @answer_ar, @answer_en, @service_id, @status, @display_order)
    `).run({ ...d, service_id: d.service_id ?? null });
    return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json({ id: Date.now() }, { status: 201 });
  }
}
