import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, setSetting } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/apiGuard";

export async function GET() {
  if (supabase) {
    try {
      const { data } = await supabase.from("site_settings").select("*");
      if (data && data.length > 0) {
        const settingsMap: Record<string, string> = {};
        data.forEach((item: any) => { settingsMap[item.key] = item.value; });
        return NextResponse.json({ ...getAllSettings(), ...settingsMap });
      }
    } catch {}
  }
  return NextResponse.json(getAllSettings());
}

export async function PATCH(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (supabase) {
    try {
      const updates = Object.entries(body).map(([key, value]) => ({
        key,
        value: String(value),
        updated_at: new Date().toISOString(),
      }));
      await supabase.from("site_settings").upsert(updates);
    } catch (e) {
      console.warn("Supabase settings update error:", e);
    }
  }

  for (const [key, value] of Object.entries(body)) {
    setSetting(key, String(value));
  }
  return NextResponse.json({ ok: true });
}
