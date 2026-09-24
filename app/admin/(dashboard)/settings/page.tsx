"use client";

import { useEffect, useState } from "react";

const FIELDS: { key: string; label: string; type?: "text" | "checkbox" | "color" }[] = [
  { key: "site_name", label: "اسم الموقع" },
  { key: "email", label: "البريد الإلكتروني" },
  { key: "phone", label: "رقم الهاتف" },
  { key: "whatsapp", label: "رقم واتساب" },
  { key: "whatsapp_enabled", label: "تفعيل زر واتساب العائم", type: "checkbox" },
  { key: "content_service_enabled", label: "تفعيل خدمة كتابة المحتوى", type: "checkbox" },
  { key: "address_ar", label: "العنوان (عربي)" },
  { key: "address_en", label: "Address (English)" },
  { key: "instagram", label: "رابط Instagram" },
  { key: "facebook", label: "رابط Facebook" },
  { key: "tiktok", label: "رابط TikTok" },
  { key: "linkedin", label: "رابط LinkedIn" },
  { key: "telegram", label: "رابط Telegram" },
  { key: "google_analytics_id", label: "معرّف Google Analytics" },
  { key: "primary_color", label: "اللون الأساسي", type: "color" },
  { key: "secondary_color", label: "اللون الثانوي", type: "color" },
  { key: "accent_color", label: "لون الإبراز", type: "color" },
  { key: "meta_title_ar", label: "Meta Title (عربي)" },
  { key: "meta_title_en", label: "Meta Title (English)" },
  { key: "meta_description_ar", label: "Meta Description (عربي)" },
  { key: "meta_description_en", label: "Meta Description (English)" },
];

export default function AdminSettingsPage() {
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
      <h1 className="text-xl font-bold text-[#0b1e3f]">إعدادات الموقع</h1>
      <p className="mt-1 text-sm text-gray-500">
        ملاحظة: تغيير الألوان هنا يُخزَّن في قاعدة البيانات، ولتطبيقه فعليًا على تصميم الموقع اربطه بمتغيرات CSS في globals.css.
      </p>

      <div className="mt-6 grid gap-4 rounded-2xl border border-black/5 bg-white p-6 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.type === "checkbox" ? "flex items-center gap-2" : ""}>
            {f.type === "checkbox" ? (
              <>
                <input
                  type="checkbox"
                  checked={values[f.key] === "true"}
                  onChange={(e) => setValues({ ...values, [f.key]: String(e.target.checked) })}
                />
                <label className="text-sm text-[#0b1e3f]">{f.label}</label>
              </>
            ) : (
              <>
                <label className="mb-1 block text-sm font-medium text-[#0b1e3f]">{f.label}</label>
                <input
                  type={f.type === "color" ? "color" : "text"}
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  className="input w-full"
                />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button onClick={save} className="rounded-full bg-gradient-to-l from-[#0b1e3f] to-[#5b2ebd] px-6 py-2.5 text-sm font-semibold text-white">
          حفظ الإعدادات
        </button>
        {saved && <span className="text-sm text-green-600">تم الحفظ بنجاح</span>}
      </div>
    </div>
  );
}
