import { locales, defaultLocale, getDictionary, type Locale } from "@/lib/i18n/config";
import { getPublishedServices } from "@/lib/data";
import PageHeader from "@/components/ui/PageHeader";
import ServicesFilterGrid from "@/components/sections/ServicesFilterGrid";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  return { title: dict.servicesPage.title, description: dict.servicesPage.text };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  const services = getPublishedServices();

  return (
    <>
      <PageHeader title={dict.servicesPage.title} text={dict.servicesPage.text} />
      <section className="py-16">
        <div className="container-nexa">
          <ServicesFilterGrid services={services} locale={locale} dict={dict} />
        </div>
      </section>
    </>
  );
}
