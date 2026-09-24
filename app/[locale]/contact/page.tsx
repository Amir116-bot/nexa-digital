import { locales, defaultLocale, getDictionary, type Locale } from "@/lib/i18n/config";
import { getSiteSettings } from "@/lib/data";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/sections/ContactForm";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  return { title: dict.contactPage.title, description: dict.contactPage.text };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  const settings = getSiteSettings();

  return (
    <>
      <PageHeader title={dict.contactPage.title} text={dict.contactPage.text} />
      <section className="py-16">
        <div className="container-nexa grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">{dict.contactPage.info}</h2>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-soft)]">
              <li>{settings.email}</li>
              <li dir="ltr" className="text-end">{settings.phone}</li>
              <li>{locale === "ar" ? settings.address_ar : settings.address_en}</li>
            </ul>
          </div>
          <ContactForm dict={dict} locale={locale} />
        </div>
      </section>
    </>
  );
}
