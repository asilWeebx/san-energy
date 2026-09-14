import Link from "next/link";
import Image from "next/image";
import {
  Droplets,
  Zap,
  ArrowRight,
  Check,
  MapPin,
  Boxes,
  Wrench,
  TrendingUp,
  Compass,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/home/ContactForm";
import { Faq } from "@/components/home/Faq";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";

const advIcons = [Boxes, Wrench, TrendingUp, Compass];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale as Locale);
  const p = (path: string) => `/${locale}${path}`;

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative -mt-[72px] overflow-hidden pt-[72px]">
        <div className="glow" style={{ width: 620, height: 620, background: "rgba(255,23,71,.22)", top: -180, right: -140 }} />
        <div className="glow" style={{ width: 460, height: 460, background: "rgba(46,168,255,.12)", bottom: -160, left: -120 }} />
        <div className="absolute inset-0 grid-bg opacity-70" />

        <div className="container-x relative z-10 grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <Reveal>
              <span className="eyebrow">{d.hero.eyebrow}</span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-[clamp(34px,6vw,68px)] font-semibold leading-[1.02] max-[359px]:text-[30px]">
                {d.hero.titleLead}{" "}
                <span className="grad-red">{d.hero.titleAccent}</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[var(--color-muted)]">
                {d.hero.subtitle}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contact" className="btn btn-primary">
                  {d.nav.consult} <ArrowRight size={18} />
                </a>
                <Link href={p("/solutions")} className="btn btn-ghost">
                  {d.hero.ctaSecondary}
                </Link>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
                {d.hero.stats.map((s, i) => (
                  <div key={i}>
                    <div className="grad-silver text-[32px] font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>
                      {s.value}
                    </div>
                    <div className="mt-1.5 text-[13px] font-medium text-[var(--color-muted)]">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={160} className="relative">
            <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-line)] shadow-2xl">
              <div className="relative aspect-[4/5] w-full sm:aspect-[5/5] lg:aspect-[4/5]">
                <Image
                  src="/img/hero-sprinkler.jpg"
                  alt={d.services.drip.title}
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 44vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              </div>
              {/* floating badge */}
              <div className="absolute left-4 top-4 glass rounded-2xl px-4 py-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin size={15} className="text-[var(--color-accent-light)]" />
                  {d.brand.city}
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between glass rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent-light)]">
                    <Droplets size={18} />
                  </span>
                  <div className="text-sm font-semibold leading-tight">
                    {d.services.drip.title}
                    <div className="text-xs font-normal text-[var(--color-muted)]">{d.brand.descriptor}</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-[var(--color-faint)] lg:flex">
          <span className="text-[11px] uppercase tracking-[0.2em]">{d.hero.scroll}</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="section relative" id="services">
        <div className="container-x">
          <Reveal className="mb-12 max-w-2xl">
            <span className="eyebrow">{d.services.eyebrow}</span>
            <h2 className="mt-4 text-[clamp(26px,4vw,42px)] font-semibold">{d.services.title}</h2>
            <p className="mt-3 text-[var(--color-muted)]">{d.services.subtitle}</p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              { s: d.services.drip, icon: Droplets, img: "/img/drip-rows.jpg" },
              { s: d.services.hydro, icon: Zap, img: "/img/pump-station.png" },
            ].map(({ s, icon: Icon, img }, i) => (
              <Reveal key={i} delay={i * 90}>
                <article className="card-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-line)] glass">
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image src={img} alt={s.title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-soft)] via-[var(--color-bg-soft)]/30 to-transparent" />
                    <span className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl border border-[var(--color-line-strong)] bg-black/40 text-[var(--color-accent-light)] backdrop-blur">
                      <Icon size={22} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="text-[22px] font-semibold">{s.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--color-muted)]">{s.desc}</p>
                    <ul className="mt-5 grid gap-2.5">
                      {s.items.map((it, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[14.5px] text-[var(--color-silver-dim)]">
                          <Check size={17} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                          {it}
                        </li>
                      ))}
                    </ul>
                    <Link href={p("/solutions")} className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[var(--color-accent-light)] hover:gap-2.5 transition-all">
                      {d.services.more} <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS BAND ================= */}
      <section className="relative py-4">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-[var(--color-line)] bg-gradient-to-br from-[var(--color-accent-ink)]/40 via-[var(--color-bg-elev)] to-[var(--color-bg-elev)] p-8 sm:p-12">
              <div className="glow" style={{ width: 360, height: 360, background: "rgba(255,23,71,.2)", top: -120, right: -80 }} />
              <div className="relative z-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
                {d.stats.items.map((s, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div className="grad-red text-[clamp(34px,5vw,52px)] font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>
                      {s.value}
                    </div>
                    <div className="mt-2 text-sm font-medium text-[var(--color-silver-dim)]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= ADVANTAGES ================= */}
      <section className="section">
        <div className="container-x">
          <Reveal className="mb-12 max-w-2xl">
            <span className="eyebrow">{d.advantages.eyebrow}</span>
            <h2 className="mt-4 text-[clamp(26px,4vw,42px)] font-semibold">{d.advantages.title}</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {d.advantages.items.map((a, i) => {
              const Icon = advIcons[i] ?? Boxes;
              return (
                <Reveal key={i} delay={i * 80}>
                  <div className="card-hover h-full rounded-3xl border border-[var(--color-line)] glass p-6">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)]/12 text-[var(--color-accent-light)]">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-5 text-[18px] font-semibold">{a.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-muted)]">{a.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="section bg-[var(--color-bg-soft)]">
        <div className="container-x">
          <Reveal className="mb-12 max-w-2xl">
            <span className="eyebrow">{d.process.eyebrow}</span>
            <h2 className="mt-4 text-[clamp(26px,4vw,42px)] font-semibold">{d.process.title}</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {d.process.steps.map((s, i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="relative h-full rounded-3xl border border-[var(--color-line)] glass p-6">
                  <span
                    className="grad-red text-[46px] font-bold leading-none opacity-90"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-[18px] font-semibold">{s.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-muted)]">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS PREVIEW ================= */}
      <section className="section">
        <div className="container-x">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="eyebrow">{d.products.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(26px,4vw,42px)] font-semibold">{d.products.title}</h2>
              <p className="mt-3 text-[var(--color-muted)]">{d.products.subtitle}</p>
            </div>
            <Link href={p("/shop")} className="btn btn-ghost btn-sm">
              <ShoppingBag size={16} /> {d.nav.shop}
            </Link>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.products.lines.slice(0, 6).map((l, i) => (
              <Reveal key={i} delay={(i % 3) * 80}>
                <div className="card-hover flex h-full items-start gap-4 rounded-2xl border border-[var(--color-line)] glass p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-water)]/12 text-[var(--color-water)]">
                    <Droplets size={20} />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold">{l.name}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--color-muted)]">{l.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="section bg-[var(--color-bg-soft)]">
        <div className="container-x">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow justify-center">{d.faq.eyebrow}</span>
            <h2 className="mt-4 text-[clamp(26px,4vw,42px)] font-semibold">{d.faq.title}</h2>
          </Reveal>
          <Reveal>
            <Faq dict={d} />
          </Reveal>
        </div>
      </section>

      {/* ================= CTA BAND ================= */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-gradient-to-br from-[var(--color-accent-strong)] to-[var(--color-accent-ink)] p-10 text-center sm:p-16">
              <div className="glow" style={{ width: 500, height: 500, background: "rgba(255,120,90,.35)", top: -160, left: "40%" }} />
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="text-[clamp(26px,4.4vw,44px)] font-semibold text-white">{d.ctaBand.title}</h2>
                <p className="mt-4 text-[16px] text-white/85">{d.ctaBand.text}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a href="#contact" className="btn bg-white text-[var(--color-accent-strong)] hover:-translate-y-0.5">
                    {d.ctaBand.cta} <ArrowRight size={18} />
                  </a>
                  <a href={`tel:${site.phoneRaw}`} className="btn border border-white/40 text-white hover:bg-[var(--color-fill-3)]">
                    <Phone size={17} /> {site.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="section pt-0" id="contact">
        <div className="container-x">
          <Reveal className="mb-12 max-w-2xl">
            <span className="eyebrow">{d.contact.eyebrow}</span>
            <h2 className="mt-4 text-[clamp(26px,4vw,42px)] font-semibold">{d.contact.title}</h2>
            <p className="mt-3 text-[var(--color-muted)]">{d.contact.subtitle}</p>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
            <Reveal>
              <div className="flex h-full flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ContactCard icon={<Phone size={18} />} label={d.contact.phoneLabel} value={site.phone} href={`tel:${site.phoneRaw}`} />
                  <ContactCard icon={<Mail size={18} />} label={d.contact.emailLabel} value={site.email} href={`mailto:${site.email}`} />
                  <ContactCard icon={<MapPin size={18} />} label={d.contact.addressLabel} value={d.contact.address} />
                  <ContactCard icon={<Clock size={18} />} label={d.contact.hoursLabel} value={d.contact.hours} />
                </div>
                <div className="flex-1 overflow-hidden rounded-3xl border border-[var(--color-line)]" style={{ minHeight: 240 }}>
                  <iframe
                    src={site.mapEmbed}
                    title="map"
                    className="h-full min-h-[240px] w-full grayscale-[0.3] contrast-125"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="rounded-3xl border border-[var(--color-line)] glass p-5 sm:p-8">
                <h3 className="text-[20px] font-semibold">{d.contact.formTitle}</h3>
                <div className="mt-5">
                  <ContactForm dict={d} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="card-hover h-full rounded-2xl border border-[var(--color-line)] glass p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-accent)]/12 text-[var(--color-accent-light)]">
        {icon}
      </span>
      <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-faint)]">{label}</div>
      <div className="mt-1 text-[15px] [overflow-wrap:anywhere] font-medium text-[var(--color-ink)]">{value}</div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
