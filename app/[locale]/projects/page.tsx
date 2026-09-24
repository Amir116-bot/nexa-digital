import { locales, defaultLocale, getDictionary, type Locale } from "@/lib/i18n/config";
import { getPublishedProjects } from "@/lib/data";
import PageHeader from "@/components/ui/PageHeader";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  return { title: dict.projectsPage.title, description: dict.projectsPage.text };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (locales.includes(raw as Locale) ? raw : defaultLocale) as Locale;
  const dict = getDictionary(locale);
  const projects = getPublishedProjects();

  return (
    <>
      <PageHeader title={dict.projectsPage.title} text={dict.projectsPage.text} />
      <section className="py-16">
        <div className="container-nexa">
          {projects.length === 0 ? (
            <p className="text-center text-[var(--color-text-soft)]">{dict.projectsSection.empty}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <div key={p.id} className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                  <div className="aspect-video gradient-brand" />
                  <div className="p-5">
                    {!!p.is_demo && (
                      <span className="mb-2 inline-block rounded-full bg-black/5 px-2.5 py-0.5 text-xs text-[var(--color-text-soft)]">
                        {dict.projectsPage.demoLabel}
                      </span>
                    )}
                    <p className="text-xs font-medium text-[var(--color-secondary)]">
                      {locale === "ar" ? p.type_ar : p.type_en}
                    </p>
                    <h3 className="mt-1 font-semibold text-[var(--color-primary)]">
                      {locale === "ar" ? p.title_ar : p.title_en}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--color-text-soft)]">
                      {locale === "ar" ? p.desc_ar : p.desc_en}
                    </p>
                    {p.project_url && (
                      <a href={p.project_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-secondary)]">
                        {dict.projectsSection.viewProject} <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
