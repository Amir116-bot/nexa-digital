import { locales, defaultLocale, getDictionary, type Locale } from "@/lib/i18n/config";
import PageHeader from "@/components/ui/PageHeader";
import Process from "@/components/sections/Process";
import CTA from "@/components/sections/CTA";
import { getSiteSettings } from "@/lib/data";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  return { title: dict.howWorkPage.title };
}

export default async function HowWeWorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  const settings = getSiteSettings();

  return (
    <>
      <PageHeader title={dict.howWorkPage.title} />
      <Process dict={dict} />
      <CTA locale={locale} dict={dict} whatsapp={settings.whatsapp} whatsappEnabled={settings.whatsapp_enabled === "true"} />
    </>
  );
}
