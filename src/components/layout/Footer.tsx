import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";
import { InstagramIcon, FacebookIcon } from "@/components/ui/BrandIcons";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const p = (path: string) => `/${locale}${path}`;
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]">
      <div className="glow" style={{ width: 380, height: 380, background: "rgba(255,23,71,.14)", bottom: -120, left: -80 }} />
      <div className="container-x relative z-10 grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        <div>
          <Image src="/img/logo-full.png" alt={site.name} width={438} height={68} className="h-9 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
            {dict.footer.about}
          </p>
          <div className="mt-5 flex gap-2.5">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-2)] text-[var(--color-wa)] hover:bg-[var(--color-fill-3)] transition" aria-label="WhatsApp">
              <MessageCircle size={18} />
            </a>
            <a href={site.telegram} target="_blank" rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-2)] text-[var(--color-tg)] hover:bg-[var(--color-fill-3)] transition" aria-label="Telegram">
              <Send size={18} />
            </a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-2)] hover:bg-[var(--color-fill-3)] transition" style={{ color: "#E1306C" }} aria-label="Instagram">
              <InstagramIcon size={18} />
            </a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-2)] hover:bg-[var(--color-fill-3)] transition" style={{ color: "#1877F2" }} aria-label="Facebook">
              <FacebookIcon size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-faint)]">
            {dict.footer.navTitle}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-muted)]">
            <li><Link href={p("")} className="hover:text-[var(--color-ink)]">{dict.nav.home}</Link></li>
            <li><Link href={p("/solutions")} className="hover:text-[var(--color-ink)]">{dict.nav.solutions}</Link></li>
            <li><Link href={p("/about")} className="hover:text-[var(--color-ink)]">{dict.nav.about}</Link></li>
            <li><Link href={p("/contact")} className="hover:text-[var(--color-ink)]">{dict.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-faint)]">
            {dict.footer.solutionsTitle}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-muted)]">
            <li><Link href={p("/solutions")} className="hover:text-[var(--color-ink)]">{dict.services.drip.title}</Link></li>
            <li><Link href={p("/solutions")} className="hover:text-[var(--color-ink)]">{dict.services.hydro.title}</Link></li>
            <li><Link href={p("/shop")} className="hover:text-[var(--color-ink)]">{dict.nav.shop}</Link></li>
            <li><Link href={p("/account")} className="hover:text-[var(--color-ink)]">{dict.nav.account}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-faint)]">
            {dict.footer.contactTitle}
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
            <li className="flex gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-[var(--color-accent-light)]" />
              <a href={`tel:${site.phoneRaw}`} className="hover:text-[var(--color-ink)]">{site.phone}</a>
            </li>
            <li className="flex gap-2.5">
              <Mail size={16} className="mt-0.5 shrink-0 text-[var(--color-accent-light)]" />
              <a href={`mailto:${site.email}`} className="break-all hover:text-[var(--color-ink)]">{site.email}</a>
            </li>
            <li className="flex gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-accent-light)]" />
              <span>{dict.contact.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Clock size={16} className="mt-0.5 shrink-0 text-[var(--color-accent-light)]" />
              <span>{dict.contact.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-[var(--color-faint)] sm:flex-row">
          <span>© {year} {site.name}. {dict.footer.rights}</span>
          <span>{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}
