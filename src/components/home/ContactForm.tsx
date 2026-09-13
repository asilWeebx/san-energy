"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";

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
      <button type="submit" className="btn btn-primary w-full">
        <Send size={17} /> {c.formSubmit}
      </button>
      <p className="text-center text-xs text-[var(--color-faint)]">{c.formNote}</p>
    </form>
  );
}
