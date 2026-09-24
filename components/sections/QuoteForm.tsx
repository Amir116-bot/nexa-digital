"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import type { Service } from "@/lib/data";

type FormValues = {
  fullName: string; email: string; phone: string; company: string;
  serviceType: string; description: string; budget: string; deadline: string;
  preferredContact: string; privacyConsent: boolean;
};

export default function QuoteForm({
  dict, services, defaultService, locale,
}: { dict: any; services: Service[]; defaultService?: string; locale: string }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { serviceType: defaultService || "", preferredContact: "email" },
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function onSubmit(values: FormValues) {
    setStatus("idle");
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, String(v ?? "")));
      if (file) fd.append("file", file);

      const res = await fetch("/api/quotes", { method: "POST", body: fd });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      reset();
      setFile(null);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-black/5 bg-[var(--color-bg-soft)] p-10 text-center">
        <CheckCircle2 className="mx-auto text-[var(--color-accent)]" size={40} />
        <p className="mt-4 text-lg font-semibold text-[var(--color-primary)]">{dict.quotePage.successTitle}</p>
        <p className="mt-2 text-sm text-[var(--color-text-soft)]">{dict.quotePage.successText}</p>
      </div>
    );
  }

  const input = "w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-secondary)]";
  const label = "mb-1 block text-sm font-medium text-[var(--color-primary)]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>{dict.quotePage.fullName}</label>
          <input {...register("fullName", { required: true })} className={input} />
        </div>
        <div>
          <label className={label}>{dict.quotePage.email}</label>
          <input type="email" {...register("email", { required: true })} className={input} />
        </div>
        <div>
          <label className={label}>{dict.quotePage.phone}</label>
          <input {...register("phone", { required: true })} className={input} />
        </div>
        <div>
          <label className={label}>{dict.quotePage.company}</label>
          <input {...register("company")} className={input} />
        </div>
      </div>

      <div>
        <label className={label}>{dict.quotePage.serviceType}</label>
        <select {...register("serviceType", { required: true })} className={input}>
          <option value="" disabled>—</option>
          {services.map((s) => (
            <option key={s.id} value={s.slug}>{locale === "ar" ? s.name_ar : s.name_en}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={label}>{dict.quotePage.description}</label>
        <textarea rows={5} {...register("description", { required: true })} className={input} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>{dict.quotePage.budget}</label>
          <input {...register("budget")} className={input} />
        </div>
        <div>
          <label className={label}>{dict.quotePage.deadline}</label>
          <input {...register("deadline")} className={input} />
        </div>
      </div>

      <div>
        <label className={label}>{dict.quotePage.file}</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-[var(--color-text-soft)]"
        />
      </div>

      <div>
        <label className={label}>{dict.quotePage.preferredContact}</label>
        <select {...register("preferredContact")} className={input}>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      <label className="flex items-start gap-2 text-sm text-[var(--color-text)]/80">
        <input type="checkbox" {...register("privacyConsent", { required: true })} className="mt-1" />
        {dict.quotePage.privacyConsent}
      </label>
      {errors.privacyConsent && <p className="text-xs text-red-600">*</p>}

      {status === "error" && <p className="text-sm text-red-600">{dict.quotePage.errorGeneric}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full gradient-brand px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? dict.quotePage.submitting : dict.quotePage.submit}
      </button>
    </form>
  );
}
