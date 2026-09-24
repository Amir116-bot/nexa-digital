"use client";

import { useEffect, useState } from "react";

const FIELDS: { key: string; label: string; area: "textarea" | "text" }[] = [
  { key: "tagline_ar", label: "عنوان Hero (عربي)", area: "textarea" },
  { key: "tagline_en", label: "Hero title (English)", area: "textarea" },
];

export default function AdminContentPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setValues);
  }, []);

  async function save() {
    await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-[#0b1e3f]">محتوى الصفحات</h1>
      <p className="mt-1 text-sm text-gray-500">
        النصوص الرئيسية للموقع (العناوين، الأزرار، قسم لماذا نحن، طريقة العمل) مُنظَّمة في ملفات الترجمة
        <code className="mx-1 rounded bg-black/5 px-1.5 py-0.5">lib/i18n/ar.json</code> و
        <code className="mx-1 rounded bg-black/5 px-1.5 py-0.5">lib/i18n/en.json</code>.
        هنا يمكنك تعديل العنوان الرئيسي المخزَّن في قاعدة البيانات، وباقي النصوص عبر تحرير ملفات الترجمة مباشرة (راجع ملف README لشرح ذلك).
      </p>

      <div className="mt-6 space-y-4 rounded-2xl border border-black/5 bg-white p-6">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-medium text-[#0b1e3f]">{f.label}</label>
            {f.area === "textarea" ? (
              <textarea rows={2} value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} className="input w-full" />
            ) : (
              <input value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} className="input w-full" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button onClick={save} className="rounded-full bg-gradient-to-l from-[#0b1e3f] to-[#5b2ebd] px-6 py-2.5 text-sm font-semibold text-white">
          حفظ
        </button>
        {saved && <span className="text-sm text-green-600">تم الحفظ بنجاح</span>}
      </div>
    </div>
  );
}
