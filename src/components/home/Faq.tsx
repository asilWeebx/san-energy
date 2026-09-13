"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Faq({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-[var(--color-line)] overflow-hidden rounded-3xl border border-[var(--color-line)] glass">
      {dict.faq.items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-7"
              aria-expanded={isOpen}
            >
              <span className="flex-1 text-[16px] font-semibold text-[var(--color-ink)]">
                {it.q}
              </span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--color-line)] transition ${
                  isOpen ? "rotate-45 bg-[var(--color-accent)] text-white border-transparent" : "text-[var(--color-muted)]"
                }`}
              >
                <Plus size={16} />
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-6 text-[15px] leading-relaxed text-[var(--color-muted)] sm:px-7">
                  {it.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
