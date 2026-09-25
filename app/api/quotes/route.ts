import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiGuard";
import { z } from "zod";

import { supabase } from "@/lib/supabase";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  if (supabase) {
    const { data } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) return NextResponse.json(data);
  }

  try {
    const rows = db.prepare(`SELECT * FROM quote_requests ORDER BY created_at DESC`).all();
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}

const schema = z.object({
  fullName: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(3).max(40),
  company: z.string().max(200).optional().default(""),
  serviceType: z.string().max(120).optional().default(""),
  description: z.string().min(1).max(8000),
  budget: z.string().max(120).optional().default(""),
  deadline: z.string().max(120).optional().default(""),
  preferredContact: z.string().max(40).optional().default("email"),
  privacyConsent: z.string().optional(),
});

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  "application/pdf", "image/png", "image/jpeg", "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

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

  const form = await req.formData();
  const raw = Object.fromEntries(form.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", details: parsed.error.flatten() }, { status: 400 });
  }
  if (!raw.privacyConsent || raw.privacyConsent === "false") {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }

  let filePath: string | null = null;
  const file = form.get("file");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "file_too_large" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "file_type_not_allowed" }, { status: 400 });
    }
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      fs.mkdirSync(uploadsDir, { recursive: true });
      const ext = path.extname(file.name).slice(0, 10);
      const safeName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(uploadsDir, safeName), buffer);
      filePath = `/uploads/${safeName}`;
    } catch {}
  }

  const d = parsed.data;

  if (supabase) {
    try {
      await supabase.from("quote_requests").insert([{
        full_name: d.fullName,
        email: d.email,
        phone: d.phone,
        company: d.company,
        service_type: d.serviceType,
        description: d.description,
        budget: d.budget,
        deadline: d.deadline,
        preferred_contact: d.preferredContact,
        file_path: filePath,
        status: "new",
      }]);
    } catch (e) {
      console.warn("Supabase insertion error:", e);
    }
  }

  try {
    db.prepare(
      `INSERT INTO quote_requests
       (full_name, email, phone, company, service_type, description, budget, deadline, preferred_contact, file_path, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`
    ).run(d.fullName, d.email, d.phone, d.company, d.serviceType, d.description, d.budget, d.deadline, d.preferredContact, filePath);
  } catch (e) {
    console.warn("Quote insertion warning in serverless environment:", e);
  }

  return NextResponse.json({ ok: true });
}
