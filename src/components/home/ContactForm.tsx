"use client";
import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";
import { InstagramIcon, FacebookIcon } from "@/components/ui/BrandIcons";

const socials = [
  { key: "wa", href: site.whatsapp, label: "WhatsApp", Icon: MessageCircle, color: "var(--color-wa)" },
  { key: "tg", href: site.telegram, label: "Telegram", Icon: Send, color: "var(--color-tg)" },
  { key: "ig", href: site.instagram, label: "Instagram", Icon: InstagramIcon, color: "#E1306C" },
  { key: "fb", href: site.facebook, label: "Facebook", Icon: FacebookIcon, color: "#1877F2" },
] as const;

export function ContactForm({ dict }: { dict: Dictionary }) {
  const c = dict.contact;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErr(true);
      return;
    }
    setErr(false);
    const text =
      `${site.name} — ${c.formTitle}\n` +
      `${c.formName}: ${name}\n` +
      `${c.formPhone}: ${phone}` +
      (msg.trim() ? `\n${c.formMessage}: ${msg}` : "");
    const url = `${site.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const field =
    "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-1)] px-4 py-3 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-faint)] outline-none transition focus:border-[var(--color-accent)] focus:bg-[var(--color-fill-2)]";

  return (
    <form onSubmit={submit} className="flex flex-col gap-3.5">
      <input
        className={field}
        placeholder={c.formName}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
      />
      <input
        className={field}
        placeholder={c.formPhone}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        inputMode="tel"
        autoComplete="tel"
      />
      <textarea
        className={`${field} min-h-24 resize-none`}
        placeholder={c.formMessage}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      {err && <p className="text-sm text-[var(--color-accent-light)]">{c.formError}</p>}
      <button type="submit" className="btn btn-primary h-auto min-h-[50px] w-full whitespace-normal py-3 text-center leading-snug">
        <Send size={17} /> {c.formSubmit}
      </button>
      <p className="text-center text-xs text-[var(--color-faint)]">{c.formNote}</p>

      {/* Ijtimoiy tarmoqlar orqali bog'lanish */}
      <div className="mt-1 grid grid-cols-4 gap-2">
        {socials.map(({ key, href, label, Icon, color }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex h-11 items-center justify-center rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-1)] transition hover:border-[var(--color-line-strong)] hover:bg-[var(--color-fill-2)]"
          >
            <Icon size={19} style={{ color }} />
          </a>
        ))}
      </div>
    </form>
  );
}
