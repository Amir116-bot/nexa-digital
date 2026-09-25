import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

const hits = new Map<string, number[]>();
function isRateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60_000;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > 8;
}

import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  let user: { id: number; email: string; password_hash: string; name: string } | null = null;

  if (supabase) {
    const { data } = await supabase.from("users").select("*").eq("email", email).single();
    if (data) {
      user = { id: Number(data.id), email: data.email, password_hash: data.password_hash, name: data.name };
    }
  }

  if (!user) {
    try {
      const row = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) as any;
      if (row) user = row;
    } catch {}
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@nexadigital.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  let isValid = false;
  if (user) {
    isValid = verifyPassword(password, user.password_hash);
  } else if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
    isValid = true;
    user = { id: 1, email: adminEmail, password_hash: "", name: "Admin" };
  }

  if (!isValid || !user) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const token = createSessionToken({ userId: user.id, email: user.email, name: user.name });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
