import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { Locale } from "@/lib/i18n/config";
import type { Service } from "@/lib/data";

export default function ServiceCard({
  service, locale, detailsLabel,
}: { service: Service; locale: Locale; detailsLabel: string }) {
  const Icon = getIcon(service.icon);
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const name = locale === "ar" ? service.name_ar : service.name_en;
  const desc = locale === "ar" ? service.desc_ar : service.desc_en;

  return (
    <div className="group rounded-2xl border border-black/5 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-white">
        <Icon size={22} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-[var(--color-primary)]">{name}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">{desc}</p>
      <Link
        href={`/${locale}/services/${service.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-secondary)]"
      >
        {detailsLabel}
        <Arrow size={16} className="transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
      </Link>
    </div>
  );
}
