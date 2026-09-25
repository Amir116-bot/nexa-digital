import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/apiGuard";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["new", "reviewing", "contacted", "in_progress", "completed", "cancelled"]).optional(),
  internal_notes: z.string().max(5000).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  if (supabase) {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (parsed.data.status) updateData.status = parsed.data.status;
      if (parsed.data.internal_notes !== undefined) updateData.internal_notes = parsed.data.internal_notes;
      await supabase.from("quote_requests").update(updateData).eq("id", id);
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.warn("Supabase update error:", e);
    }
  }

  try {
    const existing = db.prepare(`SELECT * FROM quote_requests WHERE id = ?`).get(id) as any;
    if (existing) {
      const merged = { ...existing, ...parsed.data };
      db.prepare(`
        UPDATE quote_requests SET status=@status, internal_notes=@internal_notes, updated_at=CURRENT_TIMESTAMP WHERE id=@id
      `).run({ ...merged, id });
    }
  } catch {}

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  if (supabase) {
    try {
      await supabase.from("quote_requests").delete().eq("id", id);
      return NextResponse.json({ ok: true });
    } catch {}
  }

  try {
    db.prepare(`DELETE FROM quote_requests WHERE id = ?`).run(id);
  } catch {}

  return NextResponse.json({ ok: true });
}
