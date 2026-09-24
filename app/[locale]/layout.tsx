import type { Metadata } from "next";
import { locales, defaultLocale, getDictionary, type Locale } from "@/lib/i18n/config";
import { getSiteSettings } from "@/lib/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HtmlLocaleSync from "@/components/layout/HtmlLocaleSync";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale;
  const settings = getSiteSettings();
  const title = l === "ar" ? settings.meta_title_ar : settings.meta_title_en;
  const description = l === "ar" ? settings.meta_description_ar : settings.meta_description_en;
  return {
    title: { default: title, template: `%s — ${settings.site_name}` },
    description,
    openGraph: { title, description, locale: l, siteName: settings.site_name },
    alternates: { languages: { ar: "/ar", en: "/en" } },
  };
}

export default async function LocaleLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  const settings = getSiteSettings();

  return (
    <>
      <HtmlLocaleSync locale={locale} />
      <Navbar
        locale={locale}
        nav={dict.nav}
        langLabel={dict.common.langSwitch}
        siteName={settings.site_name}
      />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} settings={settings} />
      {settings.whatsapp_enabled === "true" && (
        <WhatsAppButton phone={settings.whatsapp} label={dict.common.whatsapp} />
      )}
    </>
  );
}
