import { locales, defaultLocale, getDictionary, type Locale } from "@/lib/i18n/config";
import PageHeader from "@/components/ui/PageHeader";
import WhyUs from "@/components/sections/WhyUs";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  return { title: dict.aboutPage.title };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.aboutPage.title} />
      <section className="py-16">
        <div className="container-nexa mx-auto max-w-3xl space-y-5 text-[15px] leading-8 text-[var(--color-text)]/85">
          <p>{dict.aboutPage.text1}</p>
          <p>{dict.aboutPage.text2}</p>
        </div>
      </section>
      <WhyUs dict={dict} />
    </>
  );
}
