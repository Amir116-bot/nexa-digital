import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { Briefcase, FolderKanban, FileText, Mail as MailIcon } from "lucide-react";

async function countTable(table: string, whereCol = "", whereVal = ""): Promise<number> {
  if (supabase) {
    try {
      let q = supabase.from(table).select("*", { count: "exact", head: true });
      if (whereCol && whereVal) {
        q = q.eq(whereCol, whereVal);
      }
      const { count } = await q;
      if (count !== null && count !== undefined) return count;
    } catch {}
  }
  try {
    const whereClause = whereCol && whereVal ? `WHERE ${whereCol} = '${whereVal}'` : "";
    const row = db.prepare(`SELECT COUNT(*) as c FROM ${table} ${whereClause}`).get() as { c: number } | undefined;
    if (row && typeof row.c === "number") return row.c;
  } catch {}
  return 0;
}

async function getRecentQuotes(): Promise<any[]> {
  if (supabase) {
    try {
      const { data } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(5);
      if (data) return data;
    } catch {}
  }
  try {
    const rows = db.prepare(`SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 5`).all();
    if (rows) return rows;
  } catch {}
  return [];
}

export default async function AdminDashboardPage() {
  const publishedServicesCount = await countTable("services", "status", "published");
  const projectsCount = await countTable("projects");
  const quotesCount = await countTable("quote_requests");
  const newMessagesCount = await countTable("contact_messages", "status", "new");

  const recentQuotes = await getRecentQuotes();

  const stats = [
    { label: "الخدمات المنشورة", value: publishedServicesCount, icon: Briefcase },
    { label: "المشاريع", value: projectsCount, icon: FolderKanban },
    { label: "طلبات عروض الأسعار", value: quotesCount, icon: FileText },
    { label: "الرسائل الجديدة", value: newMessagesCount, icon: MailIcon },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-[#0b1e3f]">لوحة الإحصائيات</h1>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-black/5 bg-white p-6">
            <s.icon className="text-[#5b2ebd]" size={22} />
            <p className="mt-4 text-2xl font-bold text-[#0b1e3f]">{s.value}</p>
            <p className="mt-1 text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-semibold text-[#0b1e3f]">آخر الطلبات</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="border-b border-black/5 text-gray-500">
                <th className="py-2 pe-4 font-medium">العميل</th>
                <th className="py-2 pe-4 font-medium">الخدمة</th>
                <th className="py-2 pe-4 font-medium">الحالة</th>
                <th className="py-2 pe-4 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.map((q: any) => (
                <tr key={q.id} className="border-b border-black/5">
                  <td className="py-2.5 pe-4">{q.full_name}</td>
                  <td className="py-2.5 pe-4">{q.service_type}</td>
                  <td className="py-2.5 pe-4">{q.status}</td>
                  <td className="py-2.5 pe-4 text-gray-500">{q.created_at}</td>
                </tr>
              ))}
              {recentQuotes.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-gray-400">لا توجد طلبات بعد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
