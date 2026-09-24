import { locales, defaultLocale, getDictionary, type Locale } from "@/lib/i18n/config";
import { getPublishedFaqs } from "@/lib/data";
import PageHeader from "@/components/ui/PageHeader";
import FaqAccordion from "@/components/sections/FaqAccordion";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  return { title: dict.faqSection.title, description: dict.faqSection.text };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  const faqs = getPublishedFaqs();

  return (
    <>
      <PageHeader title={dict.faqSection.title} text={dict.faqSection.text} />
      <section className="py-16">
        <div className="container-nexa">
          <FaqAccordion faqs={faqs} locale={locale} />
        </div>
      </section>
    </>
  );
}
