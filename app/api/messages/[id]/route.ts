import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/apiGuard";
import { z } from "zod";

const schema = z.object({ status: z.enum(["new", "read", "replied"]) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  if (supabase) {
    try {
      await supabase.from("contact_messages").update({ status: parsed.data.status }).eq("id", id);
      return NextResponse.json({ ok: true });
    } catch {}
  }

  try {
    db.prepare(`UPDATE contact_messages SET status = ? WHERE id = ?`).run(parsed.data.status, id);
  } catch {}

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  if (supabase) {
    try {
      await supabase.from("contact_messages").delete().eq("id", id);
      return NextResponse.json({ ok: true });
    } catch {}
  }

  try {
    db.prepare(`DELETE FROM contact_messages WHERE id = ?`).run(id);
  } catch {}

  return NextResponse.json({ ok: true });
}
