"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCart } from "@/components/providers/CartProvider";
import { site } from "@/lib/site";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  const { count } = useCart();

  // close the drawer on navigation (derived during render, not in an effect)
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const p = (path: string) => `/${locale}${path}`;
  const nav = [
    { href: p(""), label: dict.nav.home },
    { href: p("/solutions"), label: dict.nav.solutions },
    { href: p("/about"), label: dict.nav.about },
    { href: p("/contact"), label: dict.nav.contact },
  ];

  // cart lives only inside the shop; the shop CTA is pointless there
  const inShop = pathname === p("/shop") || pathname.startsWith(p("/shop/"));

  const isActive = (href: string) =>
    href === p("") ? pathname === p("") : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-[color-mix(in_srgb,var(--color-bg)_88%,transparent)] backdrop-blur-xl border-b border-[var(--color-line)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center gap-2 sm:gap-4">
        <Link href={p("")} className="flex items-center shrink-0" aria-label={site.name}>
          <Image
            src="/img/logo-emblem.png"
            alt={site.name}
            width={126}
            height={64}
            priority
            className="h-8 w-auto sm:hidden"
          />
          <Image
            src="/img/logo-full.png"
            alt={site.name}
            width={438}
            height={68}
            priority
            className="hidden h-8 w-auto sm:block xl:h-9"
          />
        </Link>

        <nav className="ml-2 hidden items-center lg:flex xl:ml-4">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive(n.href)
                  ? "text-[var(--color-ink)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a
            href={`tel:${site.phoneRaw}`}
            className="hidden items-center gap-2 whitespace-nowrap rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm font-semibold text-[var(--color-silver-dim)] hover:text-[var(--color-ink)] hover:border-[var(--color-line-strong)] transition xl:inline-flex"
          >
            <Phone size={15} className="text-[var(--color-accent-light)]" />
            {site.phone}
          </a>

          <LanguageSwitcher locale={locale} />

          <Link
            href={p("/account")}
            aria-label={dict.nav.account}
            className="hidden sm:grid h-10 w-10 place-items-center rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-fill-3)] transition"
          >
            <User size={18} />
          </Link>

          {inShop ? (
            <Link
              href={p("/shop/cart")}
              aria-label={dict.shop.viewCart}
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-fill-3)] transition"
            >
              <ShoppingCart size={18} />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--color-accent)] px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          ) : (
            <Link href={p("/shop")} className="btn btn-primary btn-sm hidden md:inline-flex">
              {dict.nav.shop}
            </Link>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={dict.nav.menu}
            aria-expanded={open}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-2)] text-[var(--color-ink)] lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-[var(--color-line)] bg-[var(--color-bg-soft)] backdrop-blur-xl">
          <div className="container-x flex flex-col gap-1 py-4">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-3 text-base font-semibold ${
                  isActive(n.href)
                    ? "bg-[var(--color-fill-2)] text-[var(--color-ink)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <div className={`mt-2 grid gap-2 ${inShop ? "" : "min-[360px]:grid-cols-2"}`}>
              {!inShop && (
                <Link href={p("/shop")} className="btn btn-primary">
                  {dict.nav.shop}
                </Link>
              )}
              <Link href={p("/account")} className="btn btn-ghost">
                {dict.nav.account}
              </Link>
            </div>
            <a href={`tel:${site.phoneRaw}`} className="btn btn-ghost mt-2">
              <Phone size={16} /> {site.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
