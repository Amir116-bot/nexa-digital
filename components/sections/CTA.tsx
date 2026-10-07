import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export default function CTA({
  locale, dict, whatsapp, whatsappEnabled,
}: { locale: Locale; dict: any; whatsapp: string; whatsappEnabled: boolean }) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-nexa">
        <div 
          style={{ backgroundColor: '#111111', color: '#ffffff' }} 
          className="rounded-3xl border border-[#C9A227] px-8 py-14 text-center sm:px-16"
        >
          <h2 style={{ color: '#ffffff' }} className="text-2xl font-bold sm:text-3xl">
            {dict.cta.title}
          </h2>
          <p style={{ color: '#cccccc' }} className="mt-4 text-base">
            {dict.cta.text}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link 
              href={`/${locale}/quote`} 
              style={{ backgroundColor: '#C9A227', color: '#000000' }}
              className="rounded-full px-7 py-3 font-bold transition-all hover:opacity-90"
            >
              {dict.cta.quoteBtn}
            </Link>
            {whatsappEnabled && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                style={{ borderColor: '#C9A227', color: '#C9A227' }}
                className="rounded-full border px-7 py-3 font-bold hover:bg-[#C9A227] hover:text-black"
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