import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiGuard";
import { z } from "zod";

import { supabase } from "@/lib/supabase";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  if (supabase) {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) return NextResponse.json(data);
  }

  try {
    const rows = db.prepare(`SELECT * FROM contact_messages ORDER BY created_at DESC`).all();
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(200).optional().default(""),
  message: z.string().min(1).max(5000),
});

// Basic per-IP rate limiting (in-memory; fine for a single instance / demo).
const hits = new Map<string, number[]>();
function isRateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60_000;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, subject, message } = parsed.data;

  if (supabase) {
    try {
      await supabase.from("contact_messages").insert([{
        name,
        email,
        subject,
        message,
        status: "new",
      }]);
    } catch (e) {
      console.warn("Supabase insertion error:", e);
    }
  }

  try {
    db.prepare(
      `INSERT INTO contact_messages (name, email, subject, message, status) VALUES (?, ?, ?, ?, 'new')`
    ).run(name, email, subject, message);
  } catch (e) {
    console.warn("Message insertion warning in serverless environment:", e);
  }

  return NextResponse.json({ ok: true });
}
