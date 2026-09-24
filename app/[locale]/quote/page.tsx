import { locales, defaultLocale, getDictionary, type Locale } from "@/lib/i18n/config";
import { getPublishedServices } from "@/lib/data";
import PageHeader from "@/components/ui/PageHeader";
import QuoteForm from "@/components/sections/QuoteForm";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  return { title: dict.quotePage.title, description: dict.quotePage.text };
}

export default async function QuotePage({
  params, searchParams,
}: { params: Promise<{ locale: string }>; searchParams: Promise<{ service?: string }> }) {
  const { locale: raw } = await params;
  const { service } = await searchParams;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  const services = getPublishedServices();

  return (
    <>
      <PageHeader title={dict.quotePage.title} text={dict.quotePage.text} />
      <section className="py-16">
        <div className="container-nexa">
          <QuoteForm dict={dict} services={services} defaultService={service} locale={locale} />
        </div>
      </section>
    </>
  );
}
