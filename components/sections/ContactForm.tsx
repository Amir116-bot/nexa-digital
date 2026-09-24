"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";

type FormValues = { name: string; email: string; subject: string; message: string };

export default function ContactForm({ dict, locale }: { dict: any; locale: string }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function onSubmit(values: FormValues) {
    setStatus("idle");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-black/5 bg-[var(--color-bg-soft)] p-8 text-center">
        <CheckCircle2 className="mx-auto text-[var(--color-accent)]" size={36} />
        <p className="mt-3 font-semibold text-[var(--color-primary)]">{dict.quotePage.successTitle}</p>
        <p className="mt-1 text-sm text-[var(--color-text-soft)]">{dict.quotePage.successText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-primary)]">{dict.contactPage.name}</label>
        <input {...register("name", { required: true })} className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-secondary)]" />
        {errors.name && <p className="mt-1 text-xs text-red-600">*</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-primary)]">{dict.contactPage.email}</label>
        <input type="email" {...register("email", { required: true })} className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-secondary)]" />
        {errors.email && <p className="mt-1 text-xs text-red-600">*</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-primary)]">{dict.contactPage.subject}</label>
        <input {...register("subject")} className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-secondary)]" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-primary)]">{dict.contactPage.message}</label>
        <textarea rows={5} {...register("message", { required: true })} className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-secondary)]" />
        {errors.message && <p className="mt-1 text-xs text-red-600">*</p>}
      </div>

      {status === "error" && <p className="text-sm text-red-600">{dict.quotePage.errorGeneric}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full gradient-brand px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? dict.quotePage.submitting : dict.contactPage.send}
      </button>
    </form>
  );
}
