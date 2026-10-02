import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import AdminMessagesClient, { MsgRow } from "./AdminMessagesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getMessages(): Promise<MsgRow[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase contact_messages fetch error:", error.message);
      } else if (data) {
        return data as MsgRow[];
      }
    } catch (e) {
      console.error("Supabase fetch exception in AdminMessagesPage:", e);
    }
  }

  try {
    const rows = db.prepare(`SELECT * FROM contact_messages ORDER BY created_at DESC`).all() as MsgRow[];
    return rows;
  } catch {
    return [];
  }
}

export default async function AdminMessagesPage() {
  const initialMessages = await getMessages();
  return <AdminMessagesClient initialRows={initialMessages} />;
}
