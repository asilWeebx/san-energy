"use client";
import type { Product } from "@/lib/shop/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { ProductCard } from "./ProductCard";

export function ProductRow({
  title,
  icon,
  badge,
  products,
  dict,
  locale,
  baseLabel,
  showStock,
}: {
  title: string;
  icon?: React.ReactNode;
  badge?: string;
  products: Product[];
  dict: Dictionary;
  locale: Locale;
  baseLabel: string;
  showStock: boolean;
}) {
  if (products.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="mb-4 flex items-center gap-2.5 text-[22px] font-semibold">
        {icon && <span className="text-[var(--color-accent-light)]">{icon}</span>}
        {title}
        {badge && (
          <span className="rounded-full bg-[var(--color-warn-soft,rgba(247,144,9,.14))] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--color-warn)]" style={{ background: "rgba(247,144,9,.14)", color: "var(--color-warn)" }}>
            {badge}
          </span>
        )}
      </h2>
      <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[180px] shrink-0 snap-start sm:w-[220px]">
            <ProductCard product={p} dict={dict} locale={locale} baseLabel={baseLabel} showStock={showStock} />
          </div>
        ))}
      </div>
    </section>
  );
}
