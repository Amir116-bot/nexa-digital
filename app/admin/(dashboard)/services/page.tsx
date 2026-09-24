"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type ServiceRow = {
  id: number; slug: string; name_ar: string; name_en: string; desc_ar: string; desc_en: string;
  features_ar: string; features_en: string; category: string; icon: string;
  price: string | null; duration: string | null; status: string; display_order: number;
};

const emptyForm = {
  slug: "", name_ar: "", name_en: "", desc_ar: "", desc_en: "",
  features_ar: "", features_en: "", category: "development", icon: "Sparkles",
  price: "", duration: "", status: "hidden", display_order: 0,
};

export default function AdminServicesPage() {
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/services");
    setRows(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(row: ServiceRow) {
    setEditingId(row.id);
    setForm({
      slug: row.slug, name_ar: row.name_ar, name_en: row.name_en, desc_ar: row.desc_ar, desc_en: row.desc_en,
      features_ar: (JSON.parse(row.features_ar) as string[]).join("\n"),
      features_en: (JSON.parse(row.features_en) as string[]).join("\n"),
      category: row.category, icon: row.icon,
      price: row.price ?? "", duration: row.duration ?? "",
      status: row.status, display_order: row.display_order,
    });
    setShowForm(true);
  }

  async function save() {
    const payload = {
      ...form,
      features_ar: form.features_ar.split("\n").map((s) => s.trim()).filter(Boolean),
      features_en: form.features_en.split("\n").map((s) => s.trim()).filter(Boolean),
      display_order: Number(form.display_order),
    };
    if (editingId) {
      await fetch(`/api/services/${editingId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/services", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
    }
    setShowForm(false);
    load();
  }

  async function toggleStatus(row: ServiceRow) {
    await fetch(`/api/services/${row.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: row.status === "published" ? "hidden" : "published" }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0b1e3f]">إدارة الخدمات</h1>
        <button onClick={startNew} className="flex items-center gap-2 rounded-full bg-gradient-to-l from-[#0b1e3f] to-[#5b2ebd] px-5 py-2.5 text-sm font-semibold text-white">
          <Plus size={16} /> إضافة خدمة
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-black/5 text-gray-500">
              <th className="p-4 font-medium">الاسم</th>
              <th className="p-4 font-medium">التصنيف</th>
              <th className="p-4 font-medium">الحالة</th>
              <th className="p-4 font-medium">الترتيب</th>
              <th className="p-4 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-black/5">
                <td className="p-4">{r.name_ar}</td>
                <td className="p-4">{r.category}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${r.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {r.status === "published" ? "منشورة" : "مخفية"}
                  </span>
                </td>
                <td className="p-4">{r.display_order}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(r)} title="تفعيل/إخفاء" className="rounded-lg p-2 hover:bg-black/5">
                      {r.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => startEdit(r)} className="rounded-lg p-2 hover:bg-black/5"><Pencil size={16} /></button>
                    <button onClick={() => remove(r.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">لا توجد خدمات بعد</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="font-semibold text-[#0b1e3f]">{editingId ? "تعديل خدمة" : "إضافة خدمة"}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input placeholder="slug (english-url-slug)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                {["development", "design", "content", "marketing", "extra"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input placeholder="الاسم بالعربية" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="input" />
              <input placeholder="Name in English" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="input" />
              <textarea placeholder="الوصف بالعربية" value={form.desc_ar} onChange={(e) => setForm({ ...form, desc_ar: e.target.value })} className="input sm:col-span-2" rows={2} />
              <textarea placeholder="Description in English" value={form.desc_en} onChange={(e) => setForm({ ...form, desc_en: e.target.value })} className="input sm:col-span-2" rows={2} />
              <textarea placeholder="المميزات (سطر لكل ميزة)" value={form.features_ar} onChange={(e) => setForm({ ...form, features_ar: e.target.value })} className="input" rows={4} />
              <textarea placeholder="Features (one per line)" value={form.features_en} onChange={(e) => setForm({ ...form, features_en: e.target.value })} className="input" rows={4} />
              <input placeholder="أيقونة (Globe, Smartphone, Palette, PenLine...)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input" />
              <input placeholder="السعر (اختياري)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
              <input placeholder="مدة التنفيذ (اختياري)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input" />
              <input type="number" placeholder="ترتيب الظهور" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="input" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
                <option value="hidden">مخفية</option>
                <option value="published">منشورة</option>
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-full border border-black/10 px-5 py-2 text-sm">إلغاء</button>
              <button onClick={save} className="rounded-full bg-gradient-to-l from-[#0b1e3f] to-[#5b2ebd] px-5 py-2 text-sm font-semibold text-white">حفظ</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input { border: 1px solid rgba(0,0,0,0.1); border-radius: 0.5rem; padding: 0.6rem 0.9rem; font-size: 0.875rem; outline: none; }
        .input:focus { border-color: #5b2ebd; }
      `}</style>
    </div>
  );
}
