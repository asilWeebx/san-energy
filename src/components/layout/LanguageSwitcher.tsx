"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { locales, localeShort, localeNames, type Locale } from "@/lib/i18n/config";
import { ChevronDown, Globe } from "lucide-react";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function switchTo(l: Locale) {
    setOpen(false);
    if (l === locale) return;
    document.cookie = `locale=${l}; path=/; max-age=31536000`;
    const parts = pathname.split("/");
    parts[1] = l; // replace locale segment
    router.push(parts.join("/") || `/${l}`);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-2)] px-3 py-2 text-sm font-semibold hover:bg-[var(--color-fill-3)] transition"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={15} className="text-[var(--color-muted)]" />
        {localeShort[locale]}
        <ChevronDown size={14} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] shadow-2xl z-50"
          role="listbox"
        >
          {locales.map((l) => (
            <li key={l}>
              <button
                onClick={() => switchTo(l)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-[var(--color-fill-2)] transition ${
                  l === locale ? "text-[var(--color-accent-light)] font-semibold" : ""
                }`}
                role="option"
                aria-selected={l === locale}
              >
                {localeNames[l]}
                <span className="text-xs text-[var(--color-faint)]">{localeShort[l]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
