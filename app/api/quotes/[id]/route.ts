import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
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

  const existing = db.prepare(`SELECT * FROM quote_requests WHERE id = ?`).get(id) as any;
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const merged = { ...existing, ...parsed.data };
  db.prepare(`
    UPDATE quote_requests SET status=@status, internal_notes=@internal_notes, updated_at=CURRENT_TIMESTAMP WHERE id=@id
  `).run({ ...merged, id });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;
  db.prepare(`DELETE FROM quote_requests WHERE id = ?`).run(id);
  return NextResponse.json({ ok: true });
}
