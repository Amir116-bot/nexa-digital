import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export default function CTA({
  locale, dict, whatsapp, whatsappEnabled,
}: { locale: Locale; dict: any; whatsapp: string; whatsappEnabled: boolean }) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-nexa">
        <div className="rounded-3xl gradient-brand px-8 py-14 text-center text-white sm:px-16">
          <h2 className="text-2xl font-bold sm:text-3xl">{dict.cta.title}</h2>
          <p className="mt-4 text-white/85">{dict.cta.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={`/${locale}/quote`} className="rounded-full bg-white px-7 py-3 font-semibold text-[var(--color-primary)]">
              {dict.cta.quoteBtn}
            </Link>
            {whatsappEnabled && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/40 px-7 py-3 font-semibold text-white hover:bg-white/10"
              >
                {dict.cta.whatsappBtn}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
