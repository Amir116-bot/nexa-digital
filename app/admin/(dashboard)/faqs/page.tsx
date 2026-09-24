"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type FaqRow = {
  id: number; question_ar: string; question_en: string; answer_ar: string; answer_en: string;
  status: string; display_order: number;
};

const emptyForm = { question_ar: "", question_en: "", answer_ar: "", answer_en: "", status: "published", display_order: 0 };

export default function AdminFaqsPage() {
  const [rows, setRows] = useState<FaqRow[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/faqs");
    setRows(await res.json());
  }
  useEffect(() => { load(); }, []);

  function startNew() { setEditingId(null); setForm(emptyForm); setShowForm(true); }
  function startEdit(r: FaqRow) {
    setEditingId(r.id);
    setForm({ question_ar: r.question_ar, question_en: r.question_en, answer_ar: r.answer_ar, answer_en: r.answer_en, status: r.status, display_order: r.display_order });
    setShowForm(true);
  }

  async function save() {
    if (editingId) {
      await fetch(`/api/faqs/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/faqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setShowForm(false); load();
  }

  async function toggleStatus(r: FaqRow) {
    await fetch(`/api/faqs/${r.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: r.status === "published" ? "hidden" : "published" }) });
    load();
  }

  async function remove(id: number) {
    if (!confirm("حذف هذا السؤال؟")) return;
    await fetch(`/api/faqs/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0b1e3f]">الأسئلة الشائعة</h1>
        <button onClick={startNew} className="flex items-center gap-2 rounded-full bg-gradient-to-l from-[#0b1e3f] to-[#5b2ebd] px-5 py-2.5 text-sm font-semibold text-white">
          <Plus size={16} /> إضافة سؤال
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5">
            <div>
              <p className="font-medium text-[#0b1e3f]">{r.question_ar}</p>
              <p className="mt-1 text-sm text-gray-500">{r.answer_ar}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => toggleStatus(r)} className="rounded-lg p-2 hover:bg-black/5">{r.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              <button onClick={() => startEdit(r)} className="rounded-lg p-2 hover:bg-black/5"><Pencil size={16} /></button>
              <button onClick={() => remove(r.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-center text-gray-400">لا توجد أسئلة بعد</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="font-semibold text-[#0b1e3f]">{editingId ? "تعديل سؤال" : "إضافة سؤال"}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input placeholder="السؤال بالعربية" value={form.question_ar} onChange={(e) => setForm({ ...form, question_ar: e.target.value })} className="input" />
              <input placeholder="Question in English" value={form.question_en} onChange={(e) => setForm({ ...form, question_en: e.target.value })} className="input" />
              <textarea placeholder="الإجابة بالعربية" value={form.answer_ar} onChange={(e) => setForm({ ...form, answer_ar: e.target.value })} className="input sm:col-span-2" rows={3} />
              <textarea placeholder="Answer in English" value={form.answer_en} onChange={(e) => setForm({ ...form, answer_en: e.target.value })} className="input sm:col-span-2" rows={3} />
              <input type="number" placeholder="ترتيب الظهور" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="input" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
                <option value="hidden">مخفي</option>
                <option value="published">منشور</option>
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-full border border-black/10 px-5 py-2 text-sm">إلغاء</button>
              <button onClick={save} className="rounded-full bg-gradient-to-l from-[#0b1e3f] to-[#5b2ebd] px-5 py-2 text-sm font-semibold text-white">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
