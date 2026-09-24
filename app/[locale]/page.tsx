import { locales, defaultLocale, getDictionary, type Locale } from "@/lib/i18n/config";
import { getPublishedServices, getPublishedProjects, getPublishedFaqs, getSiteSettings } from "@/lib/data";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyUs from "@/components/sections/WhyUs";
import Process from "@/components/sections/Process";
import ProjectsSection from "@/components/sections/ProjectsSection";
import CTA from "@/components/sections/CTA";
import FaqAccordion from "@/components/sections/FaqAccordion";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  const services = getPublishedServices();
  const projects = getPublishedProjects(3);
  const faqs = getPublishedFaqs().slice(0, 6);
  const settings = getSiteSettings();

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <TrustBar items={dict.trustBar} />
      <ServicesSection locale={locale} dict={dict} services={services} />
      <WhyUs dict={dict} />
      <Process dict={dict} />
      <ProjectsSection locale={locale} dict={dict} projects={projects} />
      <section className="py-20 sm:py-24">
        <div className="container-nexa">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">{dict.faqSection.title}</h2>
            <p className="mt-4 text-[var(--color-text-soft)]">{dict.faqSection.text}</p>
          </div>
          <FaqAccordion faqs={faqs} locale={locale} />
        </div>
      </section>
      <CTA locale={locale} dict={dict} whatsapp={settings.whatsapp} whatsappEnabled={settings.whatsapp_enabled === "true"} />
    </>
  );
}
