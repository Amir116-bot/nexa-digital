import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { locales, defaultLocale, getDictionary, type Locale } from "@/lib/i18n/config";
import { getServiceBySlug, getPublishedFaqs, getPublishedProjects } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import PageHeader from "@/components/ui/PageHeader";
import FaqAccordion from "@/components/sections/FaqAccordion";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: locale === "ar" ? service.name_ar : service.name_en,
    description: locale === "ar" ? service.desc_ar : service.desc_en,
  };
}

export default async function ServiceDetailPage({
  params,
}: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  const service = getServiceBySlug(slug);
  if (!service || service.status !== "published") notFound();

  const Icon = getIcon(service.icon);
  const name = locale === "ar" ? service.name_ar : service.name_en;
  const desc = locale === "ar" ? service.desc_ar : service.desc_en;
  const features: string[] = JSON.parse(locale === "ar" ? service.features_ar : service.features_en);
  const relatedFaqs = getPublishedFaqs().filter((f) => f.service_id === service.id);
  const relatedProjects = getPublishedProjects().filter((p) => p.service_id === service.id);

  return (
    <>
      <PageHeader title={name} text={desc} />
      <section className="py-16">
        <div className="container-nexa grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand text-white">
              <Icon size={26} />
            </div>
            <h2 className="mt-6 text-xl font-bold text-[var(--color-primary)]">
              {dict.servicesSection.title}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[var(--color-text)]/85">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--color-accent)]" size={18} />
                  {f}
                </li>
              ))}
            </ul>

            {relatedProjects.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">{dict.projectsSection.title}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {relatedProjects.map((p) => (
                    <div key={p.id} className="rounded-xl border border-black/5 p-4">
                      <p className="font-medium text-[var(--color-primary)]">
                        {locale === "ar" ? p.title_ar : p.title_en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {relatedFaqs.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">{dict.faqSection.title}</h3>
                <FaqAccordion faqs={relatedFaqs} locale={locale} />
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-black/5 bg-[var(--color-bg-soft)] p-6">
            {service.price && (
              <p className="text-sm text-[var(--color-text-soft)]">{service.price}</p>
            )}
            {service.duration && (
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">{service.duration}</p>
            )}
            <Link
              href={`/${locale}/quote?service=${service.slug}`}
              className="mt-4 block rounded-full gradient-brand px-6 py-3 text-center font-semibold text-white"
            >
              {dict.servicesSection.requestBtn}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="mt-3 block rounded-full border border-[var(--color-primary)]/20 px-6 py-3 text-center font-semibold text-[var(--color-primary)]"
            >
              {dict.nav.contact}
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
