import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/home/ContactForm";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(isLocale(locale) ? (locale as Locale) : "ru");
  return { title: d.contact.title };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale as Locale);

  const cards = [
    { icon: <Phone size={18} />, label: d.contact.phoneLabel, value: site.phone, href: `tel:${site.phoneRaw}` },
    { icon: <Mail size={18} />, label: d.contact.emailLabel, value: site.email, href: `mailto:${site.email}` },
    { icon: <MapPin size={18} />, label: d.contact.addressLabel, value: d.contact.address },
    { icon: <Clock size={18} />, label: d.contact.hoursLabel, value: d.contact.hours },
  ];

  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="glow" style={{ width: 480, height: 480, background: "rgba(255,23,71,.16)", top: -160, right: -120 }} />
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="container-x relative z-10">
          <Reveal className="max-w-3xl">
            <span className="eyebrow">{d.contact.eyebrow}</span>
            <h1 className="mt-5 text-[clamp(32px,5.4vw,56px)] font-semibold">{d.contact.title}</h1>
            <p className="mt-5 text-[17px] leading-relaxed text-[var(--color-silver-dim)]">{d.contact.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div className="flex h-full flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {cards.map((c, i) => {
                  const inner = (
                    <div className="card-hover h-full rounded-2xl border border-[var(--color-line)] glass p-5">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-accent)]/12 text-[var(--color-accent-light)]">{c.icon}</span>
                      <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-faint)]">{c.label}</div>
                      <div className="mt-1 break-words text-[15px] font-medium text-[var(--color-ink)]">{c.value}</div>
                    </div>
                  );
                  return (
                    <div key={i}>{c.href ? <a href={c.href}>{inner}</a> : inner}</div>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn flex-1" style={{ background: "var(--color-wa)", color: "#04310f" }}>
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="btn flex-1" style={{ background: "var(--color-tg)", color: "#02243a" }}>
                  <Send size={18} /> Telegram
                </a>
              </div>
              <div className="flex-1 overflow-hidden rounded-3xl border border-[var(--color-line)]" style={{ minHeight: 260 }}>
                <iframe
                  src={site.mapEmbed}
                  title="map"
                  className="h-full min-h-[260px] w-full grayscale-[0.3] contrast-125"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="rounded-3xl border border-[var(--color-line)] glass p-6 sm:p-8">
              <h2 className="text-[22px] font-semibold">{d.contact.formTitle}</h2>
              <div className="mt-5">
                <ContactForm dict={d} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
