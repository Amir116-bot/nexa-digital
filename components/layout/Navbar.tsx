"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import LangSwitcher from "./LangSwitcher";
import type { Locale } from "@/lib/i18n/config";

type NavDict = {
  home: string; services: string; projects: string; about: string;
  howWeWork: string; faq: string; contact: string; quote: string;
};

export default function Navbar({
  locale, nav, langLabel, siteName,
}: { locale: Locale; nav: NavDict; langLabel: string; siteName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/services`, label: nav.services },
    { href: `/${locale}/projects`, label: nav.projects },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/how-we-work`, label: nav.howWeWork },
    { href: `/${locale}/faq`, label: nav.faq },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled ? "bg-black/90 shadow-sm backdrop-blur border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container-nexa flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <img src="/nexa_logo.png" alt={siteName} className="h-10 w-auto" />
        </Link>

        {/* روابط القائمة الرئيسية للـ Desktop */}
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link 
              key={l.href} 
              href={l.href} 
              className="text-sm text-white transition-colors duration-200 hover:text-[var(--color-accent)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* أزرار محول اللغة وحجز الاستشارة */}
        <div className="hidden items-center gap-4 lg:flex">
          <LangSwitcher locale={locale} label={langLabel} />
          <Link
            href={`/${locale}/quote`}
            className="rounded-lg bg-[var(--color-accent)] px-5 py-2 text-sm font-bold text-black shadow-md transition-all duration-200 hover:bg-[#E6C200] hover:shadow-yellow-500/20"
          >
            {nav.quote}
          </Link>
        </div>

        {/* زر القائمة للموبايل */}
        <button 
          className="lg:hidden p-2 text-white bg-transparent border-0 shadow-none hover:bg-transparent" 
          onClick={() => setOpen(true)} 
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* قائمة الموبايل */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black lg:hidden">
          <div className="container-nexa flex h-16 items-center justify-between border-b border-white/10">
            <img src="/nexa_logo.png" alt={siteName} className="h-10 w-auto" />
            <button 
              onClick={() => setOpen(false)} 
              aria-label="Close menu"
              className="p-2 text-white bg-transparent border-0 shadow-none hover:bg-transparent"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
          <nav className="container-nexa flex flex-col gap-2 pt-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-white transition-colors hover:bg-white/10 hover:text-[var(--color-accent)]"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-4">
              <LangSwitcher locale={locale} label={langLabel} />
              <Link
                href={`/${locale}/quote`}
                onClick={() => setOpen(false)}
                className="w-full text-center rounded-lg bg-[var(--color-accent)] px-5 py-3 text-sm font-bold text-black shadow-md transition-all hover:bg-[#E6C200]"
              >
                {nav.quote}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}