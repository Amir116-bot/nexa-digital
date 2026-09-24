import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export default function Hero({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <section className="relative overflow-hidden gradient-brand text-white">
      <div className="pointer-events-none absolute -top-24 -end-24 h-96 w-96 rounded-full bg-[var(--color-accent)]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -start-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="container-nexa relative grid items-center gap-12 py-24 lg:grid-cols-2 lg:py-32">
        <div>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {dict.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
            {dict.hero.text}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/quote`}
              className="rounded-full bg-white px-7 py-3 font-semibold text-[var(--color-primary)] transition hover:opacity-90"
            >
              {dict.hero.ctaPrimary}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="rounded-full border border-white/40 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-white/40" />
              <span className="h-3 w-3 rounded-full bg-white/40" />
              <span className="h-3 w-3 rounded-full bg-white/40" />
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-3 w-3/4 rounded-full bg-white/30" />
              <div className="h-3 w-full rounded-full bg-white/20" />
              <div className="h-3 w-5/6 rounded-full bg-white/20" />
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="h-16 rounded-xl bg-white/15" />
                <div className="h-16 rounded-xl bg-white/25" />
                <div className="h-16 rounded-xl bg-white/15" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
