"use client";

import { useEffect, useState } from "react";
import { Download, Trash2, X } from "lucide-react";

type QuoteRow = {
  id: number; full_name: string; email: string; phone: string; company: string | null;
  service_type: string | null; description: string; budget: string | null; deadline: string | null;
  preferred_contact: string; file_path: string | null; status: string; internal_notes: string; created_at: string;
};

const statusLabels: Record<string, string> = {
  new: "جديد", reviewing: "قيد المراجعة", contacted: "تم التواصل",
  in_progress: "قيد التنفيذ", completed: "مكتمل", cancelled: "ملغى",
};
const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700", reviewing: "bg-amber-100 text-amber-700",
  contacted: "bg-purple-100 text-purple-700", in_progress: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700", cancelled: "bg-gray-100 text-gray-500",
};

export default function AdminQuotesPage() {
  const [rows, setRows] = useState<QuoteRow[]>([]);
  const [active, setActive] = useState<QuoteRow | null>(null);
  const [notes, setNotes] = useState("");

  async function load() {
    const res = await fetch("/api/quotes");
    setRows(await res.json());
  }
  useEffect(() => { load(); }, []);

  function open(row: QuoteRow) {
    setActive(row);
    setNotes(row.internal_notes || "");
  }

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/quotes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
    if (active?.id === id) setActive({ ...active, status });
  }

  async function saveNotes() {
    if (!active) return;
    await fetch(`/api/quotes/${active.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ internal_notes: notes }) });
    load();
  }

  async function remove(id: number) {
    if (!confirm("حذف هذا الطلب؟")) return;
    await fetch(`/api/quotes/${id}`, { method: "DELETE" });
    setActive(null);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0b1e3f]">طلبات عروض الأسعار</h1>
        <a href="/api/quotes/export" className="flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-[#0b1e3f]">
          <Download size={16} /> تصدير CSV
        </a>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-black/5 text-gray-500">
              <th className="p-4 font-medium">العميل</th>
              <th className="p-4 font-medium">الخدمة</th>
              <th className="p-4 font-medium">التاريخ</th>
              <th className="p-4 font-medium">الحالة</th>
              <th className="p-4 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="cursor-pointer border-b border-black/5 hover:bg-black/2.5" onClick={() => open(r)}>
                <td className="p-4">{r.full_name}<br /><span className="text-xs text-gray-400">{r.email}</span></td>
                <td className="p-4">{r.service_type}</td>
                <td className="p-4 text-gray-500">{r.created_at}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusColors[r.status]}`}>{statusLabels[r.status]}</span>
                </td>
                <td className="p-4">
                  <button onClick={(e) => { e.stopPropagation(); remove(r.id); }} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-gray-400">لا توجد طلبات بعد</td></tr>}
          </tbody>
        </table>
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6">
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-[#0b1e3f]">{active.full_name}</h2>
              <button onClick={() => setActive(null)}><X size={20} /></button>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="text-gray-500">البريد</dt><dd>{active.email}</dd></div>
              <div><dt className="text-gray-500">الهاتف</dt><dd dir="ltr">{active.phone}</dd></div>
              {active.company && <div><dt className="text-gray-500">الشركة</dt><dd>{active.company}</dd></div>}
              <div><dt className="text-gray-500">الخدمة</dt><dd>{active.service_type}</dd></div>
              <div><dt className="text-gray-500">الوصف</dt><dd className="whitespace-pre-wrap">{active.description}</dd></div>
              {active.budget && <div><dt className="text-gray-500">الميزانية</dt><dd>{active.budget}</dd></div>}
              {active.deadline && <div><dt className="text-gray-500">الموعد المتوقع</dt><dd>{active.deadline}</dd></div>}
              {active.file_path && (
                <div><dt className="text-gray-500">الملف المرفق</dt><dd><a className="text-[#5b2ebd] underline" href={active.file_path} target="_blank" rel="noreferrer">تحميل</a></dd></div>
              )}
            </dl>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-[#0b1e3f]">الحالة</label>
              <select value={active.status} onChange={(e) => updateStatus(active.id, e.target.value)} className="input w-full">
                {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-[#0b1e3f]">ملاحظات داخلية</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input w-full" />
              <button onClick={saveNotes} className="mt-2 rounded-full bg-gradient-to-l from-[#0b1e3f] to-[#5b2ebd] px-5 py-2 text-sm font-semibold text-white">حفظ الملاحظات</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
