import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, setSetting } from "@/lib/db";
import { requireAdmin } from "@/lib/apiGuard";

export async function GET() {
  return NextResponse.json(getAllSettings());
}

export async function PATCH(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  for (const [key, value] of Object.entries(body)) {
    setSetting(key, String(value));
  }
  return NextResponse.json({ ok: true });
}
