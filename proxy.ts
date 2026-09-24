import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin routes: not locale-prefixed, protected separately in their own layout
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (pathnameHasLocale) {
    const res = NextResponse.next();
    const locale = pathname.split("/")[1];
    res.cookies.set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale = locales.includes(cookieLocale as any) ? cookieLocale : defaultLocale;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
