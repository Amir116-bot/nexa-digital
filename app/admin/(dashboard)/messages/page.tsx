"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type MsgRow = { id: number; name: string; email: string; subject: string; message: string; status: string; created_at: string };

const labels: Record<string, string> = { new: "جديدة", read: "مقروءة", replied: "تم الرد" };

export default function AdminMessagesPage() {
  const [rows, setRows] = useState<MsgRow[]>([]);

  async function load() {
    const res = await fetch("/api/messages");
    setRows(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: number, status: string) {
    await fetch(`/api/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }

  async function remove(id: number) {
    if (!confirm("حذف هذه الرسالة؟")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-[#0b1e3f]">رسائل التواصل</h1>
      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl border border-black/5 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-[#0b1e3f]">{r.name} — <span className="text-gray-500">{r.email}</span></p>
                {r.subject && <p className="mt-1 text-sm text-gray-500">{r.subject}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="input">
                  {Object.entries(labels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button onClick={() => remove(r.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{r.message}</p>
          </div>
        ))}
        {rows.length === 0 && <p className="text-center text-gray-400">لا توجد رسائل بعد</p>}
      </div>
    </div>
  );
}
