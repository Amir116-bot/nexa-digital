import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export default function CTA({
  locale, dict, whatsapp, whatsappEnabled,
}: { locale: Locale; dict: any; whatsapp: string; whatsappEnabled: boolean }) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-nexa">
        <div className="rounded-3xl border border-[var(--color-accent)] bg-[#111111] px-8 py-14 text-center text-white sm:px-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{dict.cta.title}</h2>
          <p className="mt-4 text-zinc-300">{dict.cta.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link 
              href={`/${locale}/quote`} 
              className="rounded-full bg-[var(--color-accent)] px-7 py-3 font-semibold text-black transition-all hover:bg-[#B08D1E]"
            >
              {dict.cta.quoteBtn}
            </Link>
            {whatsappEnabled && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[var(--color-accent)] px-7 py-3 font-semibold text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)] hover:text-black"
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