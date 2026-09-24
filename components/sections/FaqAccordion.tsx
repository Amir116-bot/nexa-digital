"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Faq } from "@/lib/data";

export default function FaqAccordion({ faqs, locale }: { faqs: Faq[]; locale: Locale }) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

  return (
    <div className="mx-auto mt-10 max-w-3xl divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
      {faqs.map((f) => {
        const isOpen = openId === f.id;
        return (
          <div key={f.id}>
            <button
              onClick={() => setOpenId(isOpen ? null : f.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-[var(--color-primary)]">
                {locale === "ar" ? f.question_ar : f.question_en}
              </span>
              <ChevronDown className={`shrink-0 transition ${isOpen ? "rotate-180" : ""}`} size={18} />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 text-sm leading-7 text-[var(--color-text-soft)]">
                {locale === "ar" ? f.answer_ar : f.answer_en}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
