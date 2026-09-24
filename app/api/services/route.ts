import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiGuard";
import { z } from "zod";

const serviceSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  name_ar: z.string().min(1), name_en: z.string().min(1),
  desc_ar: z.string().min(1), desc_en: z.string().min(1),
  features_ar: z.array(z.string()).default([]),
  features_en: z.array(z.string()).default([]),
  category: z.string().min(1),
  icon: z.string().min(1),
  image: z.string().nullable().optional(),
  price: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  status: z.enum(["published", "hidden"]).default("hidden"),
  display_order: z.number().int().default(0),
});

export async function GET() {
  const rows = db.prepare(`SELECT * FROM services ORDER BY display_order ASC, id ASC`).all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid", details: parsed.error.flatten() }, { status: 400 });
  const d = parsed.data;

  try {
    const result = db.prepare(`
      INSERT INTO services (slug, name_ar, name_en, desc_ar, desc_en, features_ar, features_en, category, icon, image, price, duration, status, display_order)
      VALUES (@slug, @name_ar, @name_en, @desc_ar, @desc_en, @features_ar, @features_en, @category, @icon, @image, @price, @duration, @status, @display_order)
    `).run({
      ...d,
      features_ar: JSON.stringify(d.features_ar),
      features_en: JSON.stringify(d.features_en),
      image: d.image ?? null, price: d.price ?? null, duration: d.duration ?? null,
    });
    return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
  } catch (e: any) {
    if (String(e.message).includes("UNIQUE")) {
      return NextResponse.json({ error: "slug_taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
