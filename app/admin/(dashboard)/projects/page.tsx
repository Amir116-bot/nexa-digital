"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type ProjectRow = {
  id: number; title_ar: string; title_en: string; type_ar: string | null; type_en: string | null;
  desc_ar: string | null; desc_en: string | null; project_url: string | null;
  is_demo: number; status: string; display_order: number;
};

const emptyForm = {
  title_ar: "", title_en: "", type_ar: "", type_en: "", desc_ar: "", desc_en: "",
  project_url: "", is_demo: true, status: "hidden", display_order: 0,
};

export default function AdminProjectsPage() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/projects");
    setRows(await res.json());
  }
  useEffect(() => { load(); }, []);

  function startNew() { setEditingId(null); setForm(emptyForm); setShowForm(true); }
  function startEdit(r: ProjectRow) {
    setEditingId(r.id);
    setForm({
      title_ar: r.title_ar, title_en: r.title_en, type_ar: r.type_ar ?? "", type_en: r.type_en ?? "",
      desc_ar: r.desc_ar ?? "", desc_en: r.desc_en ?? "", project_url: r.project_url ?? "",
      is_demo: !!r.is_demo, status: r.status, display_order: r.display_order,
    });
    setShowForm(true);
  }

  async function save() {
    const payload = { ...form, gallery: [] };
    if (editingId) {
      await fetch(`/api/projects/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    setShowForm(false); load();
  }

  async function toggleStatus(r: ProjectRow) {
    await fetch(`/api/projects/${r.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: r.status === "published" ? "hidden" : "published" }) });
    load();
  }

  async function remove(id: number) {
    if (!confirm("حذف هذا المشروع؟")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0b1e3f]">إدارة المشاريع</h1>
        <button onClick={startNew} className="flex items-center gap-2 rounded-full bg-gradient-to-l from-[#0b1e3f] to-[#5b2ebd] px-5 py-2.5 text-sm font-semibold text-white">
          <Plus size={16} /> إضافة مشروع
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-black/5 text-gray-500">
              <th className="p-4 font-medium">العنوان</th>
              <th className="p-4 font-medium">النوع</th>
              <th className="p-4 font-medium">تجريبي</th>
              <th className="p-4 font-medium">الحالة</th>
              <th className="p-4 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-black/5">
                <td className="p-4">{r.title_ar}</td>
                <td className="p-4">{r.type_ar}</td>
                <td className="p-4">{r.is_demo ? "نعم" : "لا"}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${r.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {r.status === "published" ? "منشور" : "مخفي"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(r)} className="rounded-lg p-2 hover:bg-black/5">{r.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    <button onClick={() => startEdit(r)} className="rounded-lg p-2 hover:bg-black/5"><Pencil size={16} /></button>
                    <button onClick={() => remove(r.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-gray-400">لا توجد مشاريع بعد</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="font-semibold text-[#0b1e3f]">{editingId ? "تعديل مشروع" : "إضافة مشروع"}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input placeholder="العنوان بالعربية" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="input" />
              <input placeholder="Title in English" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="input" />
              <input placeholder="نوع المشروع (عربي)" value={form.type_ar} onChange={(e) => setForm({ ...form, type_ar: e.target.value })} className="input" />
              <input placeholder="Project type (English)" value={form.type_en} onChange={(e) => setForm({ ...form, type_en: e.target.value })} className="input" />
              <textarea placeholder="وصف مختصر (عربي)" value={form.desc_ar} onChange={(e) => setForm({ ...form, desc_ar: e.target.value })} className="input sm:col-span-2" rows={2} />
              <textarea placeholder="Short description (English)" value={form.desc_en} onChange={(e) => setForm({ ...form, desc_en: e.target.value })} className="input sm:col-span-2" rows={2} />
              <input placeholder="رابط المشروع (اختياري)" value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} className="input sm:col-span-2" />
              <input type="number" placeholder="ترتيب الظهور" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="input" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
                <option value="hidden">مخفي</option>
                <option value="published">منشور</option>
              </select>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input type="checkbox" checked={form.is_demo} onChange={(e) => setForm({ ...form, is_demo: e.target.checked })} />
                مشروع تجريبي (وضّح ذلك للزوار بدلًا من نسبته لعميل حقيقي)
              </label>
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
