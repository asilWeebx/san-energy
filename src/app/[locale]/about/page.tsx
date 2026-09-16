import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Check, ArrowRight, Target } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteImages } from "@/lib/siteImages";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(isLocale(locale) ? (locale as Locale) : "ru");
  return { title: d.aboutPage.title };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale as Locale);
  const p = (path: string) => `/${locale}${path}`;

  // Admin panelidan boshqariladigan "Biz haqimizda" rasmlari
  const aboutImages = (await getSiteImages("about")).filter((i) => i.is_active);
  const mainAbout = aboutImages[0]?.url || null;
  const restAbout = aboutImages.slice(1);

  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="glow" style={{ width: 480, height: 480, background: "rgba(255,23,71,.16)", top: -160, right: -120 }} />
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="container-x relative z-10">
          <Reveal className="max-w-3xl">
            <span className="eyebrow">{d.aboutPage.eyebrow}</span>
            <h1 className="mt-5 text-[clamp(32px,5.4vw,56px)] font-semibold">{d.aboutPage.title}</h1>
            <p className="mt-5 text-[17px] leading-relaxed text-[var(--color-silver-dim)]">{d.aboutPage.lead}</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-6">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-[var(--color-line)]">
              <div className="relative aspect-[4/3] w-full">
                {mainAbout ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mainAbout} alt={d.brand.name} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <Image src="/img/facility.jpg" alt={d.brand.name} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="space-y-5 text-[16px] leading-relaxed text-[var(--color-muted)]">
              <p>{d.aboutPage.p1}</p>
              <p>{d.aboutPage.p2}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-[var(--color-line)] bg-gradient-to-br from-[var(--color-accent-ink)]/40 to-[var(--color-bg-elev)] p-8 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)]/15 text-[var(--color-accent-light)]">
                <Target size={22} />
              </span>
              <h2 className="mt-5 text-[26px] font-semibold">{d.aboutPage.missionTitle}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-[var(--color-silver-dim)]">{d.aboutPage.mission}</p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="h-full rounded-3xl border border-[var(--color-line)] glass p-8 sm:p-10">
              <h2 className="text-[22px] font-semibold">{d.aboutPage.doTitle}</h2>
              <ul className="mt-5 grid gap-3">
                {d.aboutPage.doItems.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-[var(--color-silver-dim)]">
                    <Check size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {restAbout.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {restAbout.map((img) => (
                <Reveal key={img.id}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--color-line)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.title || d.brand.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section pt-0">
        <div className="container-x">
          <Reveal className="mb-10 max-w-2xl">
            <span className="eyebrow">{d.advantages.eyebrow}</span>
            <h2 className="mt-4 text-[clamp(24px,4vw,38px)] font-semibold">{d.advantages.title}</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {d.advantages.items.map((a, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="card-hover h-full rounded-3xl border border-[var(--color-line)] glass p-6">
                  <h3 className="text-[18px] font-semibold">{a.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-muted)]">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link href={p("/contact")} className="btn btn-primary">
              {d.nav.consult} <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
