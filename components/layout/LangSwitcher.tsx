"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

export default function LangSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale() {
    const target: Locale = locale === "ar" ? "en" : "ar";
    const rest = pathname.replace(/^\/(ar|en)/, "");
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000`;
    router.push(`/${target}${rest || ""}`);
  }

  return (
    <button
      onClick={switchLocale}
      className="rounded-full border border-[var(--color-primary)]/15 px-3.5 py-1.5 text-sm font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/5"
      aria-label="Switch language"
    >
      {label}
    </button>
  );
}
