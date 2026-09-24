import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiGuard";
import { z } from "zod";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  const rows = db.prepare(`SELECT * FROM contact_messages ORDER BY created_at DESC`).all();
  return NextResponse.json(rows);
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
  db.prepare(
    `INSERT INTO contact_messages (name, email, subject, message, status) VALUES (?, ?, ?, ?, 'new')`
  ).run(name, email, subject, message);

  return NextResponse.json({ ok: true });
}
