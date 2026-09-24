import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiGuard";

function csvEscape(v: unknown) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const rows = db.prepare(`SELECT * FROM quote_requests ORDER BY created_at DESC`).all() as Record<string, unknown>[];
  const headers = ["id", "full_name", "email", "phone", "company", "service_type", "description", "budget", "deadline", "preferred_contact", "status", "created_at"];
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="quote-requests.csv"`,
    },
  });
}
