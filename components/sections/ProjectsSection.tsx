import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Project } from "@/lib/data";

export default function ProjectsSection({
  locale, dict, projects,
}: { locale: Locale; dict: any; projects: Project[] }) {
  return (
    <section className="bg-[var(--color-bg-soft)] py-20 sm:py-24">
      <div className="container-nexa">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">{dict.projectsSection.title}</h2>
          <p className="mt-4 text-[var(--color-text-soft)]">{dict.projectsSection.text}</p>
        </div>

        {projects.length === 0 ? (
          <p className="mt-12 text-center text-[var(--color-text-soft)]">{dict.projectsSection.empty}</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                <div className="aspect-video gradient-brand" />
                <div className="p-5">
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
  );
}
