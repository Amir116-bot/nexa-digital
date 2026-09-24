"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dictionaries, defaultLocale, type Locale } from "@/lib/i18n/config";

export default function NotFound() {
  const pathname = usePathname();
  const seg = pathname?.split("/")[1];
  const locale = (seg === "en" ? "en" : defaultLocale) as Locale;
  const dict = dictionaries[locale];

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-[var(--color-secondary)]">404</p>
      <h1 className="mt-4 text-xl font-semibold text-[var(--color-primary)]">{dict.notFound.title}</h1>
      <p className="mt-2 text-[var(--color-text-soft)]">{dict.notFound.text}</p>
      <Link href={`/${locale}`} className="mt-6 rounded-full gradient-brand px-6 py-2.5 text-sm font-semibold text-white">
        {dict.notFound.back}
      </Link>
    </div>
  );
}
