import Link from "next/link";
import ServiceCard from "./ServiceCard";
import type { Locale } from "@/lib/i18n/config";
import type { Service } from "@/lib/data";

export default function ServicesSection({
  locale, dict, services,
}: { locale: Locale; dict: any; services: Service[] }) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-nexa">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">{dict.servicesSection.title}</h2>
          <p className="mt-4 text-[var(--color-text-soft)]">{dict.servicesSection.text}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} locale={locale} detailsLabel={dict.servicesSection.detailsBtn} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/services`}
            className="inline-block rounded-full border border-[var(--color-primary)]/20 px-6 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/5"
          >
            {dict.servicesSection.allBtn}
          </Link>
        </div>
      </div>
    </section>
  );
}
