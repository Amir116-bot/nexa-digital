import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export default function CTA({
  locale, dict, whatsapp, whatsappEnabled,
}: { locale: Locale; dict: any; whatsapp: string; whatsappEnabled: boolean }) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-nexa">
        <div className="relative overflow-hidden rounded-3xl border border-[#C9A227]/40 bg-[#0B0B0B] px-8 py-14 text-center sm:px-16 shadow-2xl">
          {/* تأثير توهج خلفي ذهبي خفيف */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[#C9A227]/10 blur-3xl" />

          <h2 className="relative z-10 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {dict.cta.title}
          </h2>
          
          <p className="relative z-10 mt-4 text-base text-zinc-300 sm:text-lg max-w-2xl mx-auto">
            {dict.cta.text}
          </p>

          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-4">
            {/* زر طلب عرض سعر (ذهبي ممتلئ) */}
            <Link 
              href={`/${locale}/quote`} 
              className="rounded-full bg-[#C9A227] px-8 py-3.5 text-sm font-bold text-black shadow-lg shadow-[#C9A227]/20 transition-all duration-200 hover:bg-[#B08D1E] hover:scale-105"
            >
              {dict.cta.quoteBtn}
            </Link>

            {/* زر الواتساب (إطار ذهبي) */}
            {whatsappEnabled && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#C9A227] px-8 py-3.5 text-sm font-bold text-[#C9A227] transition-all duration-200 hover:bg-[#C9A227] hover:text-black hover:scale-105"
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