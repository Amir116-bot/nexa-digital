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

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-[var(--color-accent)] transition hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LangSwitcher locale={locale} label={langLabel} />
          <Link
            href={`/${locale}/quote`}
            className="rounded-full gradient-brand px-5 py-2 text-sm font-semibold text-black shadow-sm transition hover:opacity-90"
          >
            {nav.quote}
          </Link>
        </div>

        <button className="lg:hidden text-white" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black lg:hidden">
          <div className="container-nexa flex h-16 items-center justify-between">
            <img src="/nexa_logo.png" alt={siteName} className="h-10 w-auto" />
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={24} className="text-white" />
            </button>
          </div>
          <nav className="container-nexa flex flex-col gap-1 pt-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-[var(--color-text)] hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-3">
              <LangSwitcher locale={locale} label={langLabel} />
              <Link
                href={`/${locale}/quote`}
                onClick={() => setOpen(false)}
                className="rounded-full gradient-brand px-5 py-2 text-sm font-semibold text-black"
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
