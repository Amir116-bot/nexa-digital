import Link from "next/link";
import { AtSign, Globe2, Users, Send } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export default function Footer({
  locale, dict, settings,
}: {
  locale: Locale;
  dict: any;
  settings: Record<string, string>;
}) {
  const year = new Date().getFullYear();
  const social = [
    { key: "instagram", icon: AtSign, url: settings.instagram },
    { key: "facebook", icon: Users, url: settings.facebook },
    { key: "linkedin", icon: Globe2, url: settings.linkedin },
    { key: "telegram", icon: Send, url: settings.telegram },
  ].filter((s) => s.url);

  return (
    <footer className="border-t border-black/5 bg-[var(--color-bg-soft)]">
      <div className="container-nexa grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-[var(--color-primary)]">{settings.site_name}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-soft)]">{dict.footer.desc}</p>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-primary)]">{dict.footer.pages}</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-soft)]">
            <li><Link href={`/${locale}/about`}>{dict.nav.about}</Link></li>
            <li><Link href={`/${locale}/how-we-work`}>{dict.nav.howWeWork}</Link></li>
            <li><Link href={`/${locale}/faq`}>{dict.nav.faq}</Link></li>
            <li><Link href={`/${locale}/contact`}>{dict.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-primary)]">{dict.footer.servicesTitle}</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-soft)]">
            <li><Link href={`/${locale}/services`}>{dict.servicesPage.title}</Link></li>
            <li><Link href={`/${locale}/projects`}>{dict.nav.projects}</Link></li>
            <li><Link href={`/${locale}/quote`}>{dict.nav.quote}</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-[var(--color-primary)]">{dict.footer.contactTitle}</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-soft)]">
            <li>{settings.email}</li>
            <li dir="ltr" className="text-end">{settings.phone}</li>
            <li>{locale === "ar" ? settings.address_ar : settings.address_en}</li>
          </ul>
          {social.length > 0 && (
            <div className="mt-4 flex gap-3">
              {social.map(({ key, icon: Icon, url }) => (
                <a key={key} href={url} target="_blank" rel="noreferrer" className="text-[var(--color-primary)]/70 hover:text-[var(--color-primary)]">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="container-nexa flex flex-col items-center justify-between gap-3 py-5 text-xs text-[var(--color-text-soft)] sm:flex-row">
          <p>© {year} {settings.site_name}. {dict.footer.rights}</p>
          <div className="flex gap-4">
            <Link href={`/${locale}/privacy`}>{dict.footer.privacy}</Link>
            <Link href={`/${locale}/terms`}>{dict.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
