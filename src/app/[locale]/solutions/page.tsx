import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Check, ArrowRight, Droplets, Zap, ShoppingBag, Cog } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/ui/Reveal";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(isLocale(locale) ? (locale as Locale) : "ru");
  return { title: d.solutionsPage.title };
}

export default async function SolutionsPage({
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
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="glow" style={{ width: 520, height: 520, background: "rgba(46,168,255,.14)", top: -180, left: -120 }} />
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="container-x relative z-10">
          <Reveal className="max-w-3xl">
            <span className="eyebrow">{d.solutionsPage.eyebrow}</span>
            <h1 className="mt-5 text-[clamp(32px,5.4vw,56px)] font-semibold">{d.solutionsPage.title}</h1>
            <p className="mt-5 text-[17px] leading-relaxed text-[var(--color-silver-dim)]">{d.solutionsPage.subtitle}</p>
          </Reveal>
        </div>
      </section>

      {/* DRIP */}
      <FeatureBlock
        icon={<Droplets size={22} />}
        badge={d.products.dripTitle}
        title={d.services.drip.title}
        desc={d.services.drip.desc}
        items={d.services.drip.items}
        img="/img/drip-rows.jpg"
        reversed={false}
      />

      {/* FIELD SYSTEMS */}
      <section className="section">
        <div className="container-x">
          <Reveal className="mb-10 max-w-2xl">
            <span className="eyebrow"><Cog size={13} /> {d.products.eyebrow}</span>
            <h2 className="mt-4 text-[clamp(24px,4vw,40px)] font-semibold">{d.products.fieldTitle}</h2>
            <p className="mt-3 text-[var(--color-muted)]">{d.products.subtitle}</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.products.lines.map((l, i) => (
              <Reveal key={i} delay={(i % 3) * 70}>
                <div className="card-hover flex h-full items-start gap-4 rounded-2xl border border-[var(--color-line)] glass p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-accent)]/12 text-[var(--color-accent-light)]">
                    <Droplets size={19} />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold">{l.name}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--color-muted)]">{l.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 flex flex-wrap gap-3">
            <Link href={p("/shop")} className="btn btn-ghost">
              <ShoppingBag size={17} /> {d.nav.shop}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* MINI HYDRO */}
      <FeatureBlock
        icon={<Zap size={22} />}
        badge={d.products.hydroTitle}
        title={d.services.hydro.title}
        desc={d.services.hydro.desc}
        items={d.services.hydro.items}
        img="/img/pump-station.png"
        reversed
        tinted
      />

      <section className="section pt-4">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-gradient-to-br from-[var(--color-accent-strong)] to-[var(--color-accent-ink)] p-10 text-center sm:p-14">
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="text-[clamp(24px,4vw,40px)] font-semibold text-white">{d.ctaBand.title}</h2>
                <p className="mt-3 text-white/85">{d.ctaBand.text}</p>
                <div className="mt-7 flex justify-center">
                  <Link href={p("/contact")} className="btn bg-white text-[var(--color-accent-strong)]">
                    {d.ctaBand.cta} <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function FeatureBlock({
  icon,
  badge,
  title,
  desc,
  items,
  img,
  reversed,
  tinted,
}: {
  icon: React.ReactNode;
  badge: string;
  title: string;
  desc: string;
  items: readonly string[];
  img: string;
  reversed: boolean;
  tinted?: boolean;
}) {
  return (
    <section className={`section ${tinted ? "bg-[var(--color-bg-soft)]" : ""}`}>
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <Reveal className={reversed ? "lg:order-2" : ""}>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--color-line)]">
            <div className="relative aspect-[4/3] w-full">
              <Image src={img} alt={title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>
        </Reveal>
        <Reveal delay={90} className={reversed ? "lg:order-1" : ""}>
          <span className="pill"><span className="text-[var(--color-accent-light)]">{icon}</span> {badge}</span>
          <h2 className="mt-4 text-[clamp(24px,4vw,40px)] font-semibold">{title}</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[var(--color-muted)]">{desc}</p>
          <ul className="mt-6 grid gap-3">
            {items.map((it, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] text-[var(--color-silver-dim)]">
                <Check size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                {it}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
