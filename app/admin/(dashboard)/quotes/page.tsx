import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import AdminQuotesClient, { QuoteRow } from "./AdminQuotesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getQuotes(): Promise<QuoteRow[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase quote_requests fetch error:", error.message);
      } else if (data) {
        return data as QuoteRow[];
      }
    } catch (e) {
      console.error("Supabase fetch exception in AdminQuotesPage:", e);
    }
  }

  try {
    const rows = db.prepare(`SELECT * FROM quote_requests ORDER BY created_at DESC`).all() as QuoteRow[];
    return rows;
  } catch {
    return [];
  }
}

export default async function AdminQuotesPage() {
  const initialQuotes = await getQuotes();
  return <AdminQuotesClient initialRows={initialQuotes} />;
}
