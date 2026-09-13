import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.[^/]+$/;

function pickLocale(req: NextRequest): string {
  const cookie = req.cookies.get("locale")?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie;
  const accept = req.headers.get("accept-language") || "";
  const wanted = accept.split(",").map((p) => p.split(";")[0].trim().slice(0, 2).toLowerCase());
  for (const w of wanted) {
    if ((locales as readonly string[]).includes(w)) return w;
  }
  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // skip api, next internals, static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/img") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // already has a locale prefix?
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  const locale = pickLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
