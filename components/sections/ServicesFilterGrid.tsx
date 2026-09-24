"use client";

import { useMemo, useState } from "react";
import ServiceCard from "./ServiceCard";
import type { Locale } from "@/lib/i18n/config";
import type { Service } from "@/lib/data";

export default function ServicesFilterGrid({
  services, locale, dict,
}: { services: Service[]; locale: Locale; dict: any }) {
  const categories = useMemo(() => {
    const set = Array.from(new Set(services.map((s) => s.category)));
    return set;
  }, [services]);
  const [active, setActive] = useState<string>("all");

  const filtered = active === "all" ? services : services.filter((s) => s.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setActive("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            active === "all" ? "gradient-brand text-white" : "border border-black/10 text-[var(--color-text)]/70"
          }`}
        >
          {dict.servicesPage.filterAll}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active === cat ? "gradient-brand text-white" : "border border-black/10 text-[var(--color-text)]/70"
            }`}
          >
            {dict.servicesPage.categories[cat] ?? cat}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <ServiceCard key={s.id} service={s} locale={locale} detailsLabel={dict.servicesSection.detailsBtn} />
        ))}
      </div>
    </div>
  );
}
