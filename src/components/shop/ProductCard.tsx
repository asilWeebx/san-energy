"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Minus, Check, ArrowRight, ShoppingCart } from "lucide-react";
import type { Product, CartLine } from "@/lib/shop/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { money, origFrom } from "@/lib/format";
import { useCart } from "@/components/providers/CartProvider";
import { ShopImage } from "./ShopImage";
import { QtyInput } from "./QtyInput";

export function ProductCard({
  product,
  dict,
  locale,
  baseLabel,
  showStock,
}: {
  product: Product;
  dict: Dictionary;
  locale: Locale;
  baseLabel: string;
  showStock: boolean;
}) {
  const { add, lines } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const variants = product.variants || [];
  const units = product.units || [];
  const [unitId, setUnitId] = useState<number | null>(units[0]?.unit_id ?? null);

  const href = `/${locale}/shop/product/${product.id}`;
  const isTracked = product.stock_type === "tracked";
  const inCart = useMemo(
    () => lines.filter((l) => l.product_id === product.id).reduce((s, l) => s + l.qty, 0),
    [lines, product.id]
  );

  // ── price / stock derivation ──
  const unit = units.find((u) => u.unit_id === unitId) ?? units[0];
  const minVariant = useMemo(() => {
    if (!product.has_variants || variants.length === 0) return null;
    return variants.reduce((m, v) => (v.cur_price < m.cur_price ? v : m), variants[0]);
  }, [product.has_variants, variants]);

  const variantInStock = variants.filter((v) => v.in_stock).length;
  const soldOut = showStock && (product.has_variants ? variantInStock === 0 : !product.in_stock);

  const priceCur = product.has_variants ? minVariant?.cur_price ?? 0 : unit?.cur_price ?? 0;
  const priceCurrency = product.has_variants ? minVariant?.currency ?? "" : unit?.currency ?? "";
  const rawOrig = product.has_variants ? minVariant?.cur_original_price ?? null : unit?.cur_original_price ?? null;
  const origCur = origFrom(priceCur, rawOrig, product.discount_percent);
  const showFrom = product.has_variants || units.length > 1;

  const maxQty = isTracked && product.stock != null ? Math.floor(product.stock / (unit?.multiplier || 1)) : Infinity;
  const capped = Number.isFinite(maxQty);
  const cartKey = `${product.id}::${unit?.unit_id ?? ""}`;
  const lineQty = lines.find((l) => l.key === cartKey)?.qty ?? 0;
  const atMax = capped && lineQty >= maxQty;
  const unitName = unit?.unit_name || dict.shop.pieces;

  const metaLine = soldOut
    ? { text: dict.shop.soldOutMeta, red: true }
    : product.has_variants
    ? { text: `${variantInStock} ${dict.shop.variantWord} ${dict.shop.available}`, red: false }
    : isTracked && Number.isFinite(maxQty)
    ? { text: `${maxQty} ${unitName} ${dict.shop.available}`, red: false }
    : null;

  const remaining = capped ? Math.max(0, maxQty - lineQty) : Infinity;

  function onAdd() {
    if (!unit || soldOut || atMax) return;
    const addQty = capped ? Math.min(qty, remaining) : qty;
    if (addQty < 1) return;
    const line: CartLine = {
      key: cartKey,
      product_id: product.id,
      unit_id: unit.unit_id ?? undefined,
      name: product.name,
      image: product.image,
      qty: addQty,
      price: unit.price,
      currency: unit.currency,
      cur_price: unit.cur_price,
      maxQty: capped ? maxQty : undefined,
    };
    add(line, addQty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <div className="card-hover flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] glass">
      <Link href={href} className="relative block aspect-square w-full overflow-hidden bg-[var(--color-fill-1)]">
        <ShopImage
          src={product.image}
          alt={product.name}
          iconSize={38}
          className={`h-full w-full object-cover transition duration-500 hover:scale-105 ${soldOut ? "opacity-45 grayscale" : ""}`}
        />
        {product.discount_percent > 0 && (
          <span className="absolute left-2.5 top-2.5 z-20 rounded-lg bg-[var(--color-accent)] px-2 py-1 text-[11px] font-bold text-white shadow">
            −{Math.round(product.discount_percent)}%
          </span>
        )}
        {priceCurrency && (
          <span className="absolute right-2.5 top-2.5 z-20 rounded-lg bg-black/55 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            {priceCurrency}
          </span>
        )}
        {inCart > 0 && !priceCurrency && (
          <span className="absolute right-2.5 top-2.5 z-20 grid h-6 min-w-6 place-items-center rounded-full bg-[var(--color-accent)] px-1.5 text-[11px] font-bold text-white">
            {inCart}
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-[color-mix(in_srgb,var(--color-bg)_58%,transparent)] backdrop-blur-[1px]">
            <span className="rounded-lg bg-black/78 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-lg">
              {dict.shop.outOfStock}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {product.category_name && (
          <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-faint)]">{product.category_name}</span>
        )}
        <Link href={href} className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug hover:text-[var(--color-accent-light)]">
          {product.name}
        </Link>

        {metaLine && (
          <span className={`mt-1.5 text-[12.5px] font-medium ${metaLine.red ? "text-[var(--color-accent-light)]" : "text-[var(--color-leaf)]"}`}>
            {metaLine.text}
          </span>
        )}

        {!product.has_variants && units.length > 1 && (
          <select
            value={unitId ?? ""}
            onChange={(e) => setUnitId(Number(e.target.value))}
            className="mt-2.5 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-fill-1)] px-2.5 py-2 text-[13px] outline-none focus:border-[var(--color-accent)]"
          >
            {units.map((u) => (
              <option key={u.unit_id ?? u.unit_name} value={u.unit_id ?? ""} className="bg-[var(--color-bg-elev)]">{u.unit_name}</option>
            ))}
          </select>
        )}

        <div className="@container mt-auto space-y-2.5 pt-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              {origCur != null && origCur > priceCur && (
                <div className="text-[12px] text-[var(--color-faint)] line-through">{money(origCur, priceCurrency, baseLabel)}</div>
              )}
              <div className="text-[17px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {showFrom && <span className="mr-1 text-[12px] font-medium text-[var(--color-muted)]">{dict.shop.from}</span>}
                {money(priceCur, priceCurrency, baseLabel)}
              </div>
            </div>

            {product.has_variants && (
              <Link href={href} className="btn btn-primary btn-sm min-w-0 shrink-0" aria-label={dict.shop.pickVariant}>
                <span className="hidden truncate @[210px]:inline">{dict.shop.pickVariant.split(" ")[0]}</span>
                <ArrowRight size={15} />
              </Link>
            )}
          </div>

          {!product.has_variants && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Miqdor: qo'lda yozish + tugmalar */}
              <div className="flex shrink-0 items-center rounded-xl border border-[var(--color-line)] p-0.5">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={soldOut}
                  className="grid h-8 w-8 place-items-center rounded-lg hover:bg-[var(--color-fill-2)] disabled:cursor-not-allowed disabled:text-[var(--color-faint)]"
                  aria-label="-"
                >
                  <Minus size={14} />
                </button>
                <QtyInput
                  value={qty}
                  max={capped ? maxQty : undefined}
                  onCommit={(n) => setQty(n)}
                  className="w-8 text-[14px]"
                />
                <button
                  type="button"
                  onClick={() => setQty((q) => (capped ? Math.min(maxQty, q + 1) : q + 1))}
                  disabled={soldOut || (capped && qty >= maxQty)}
                  className="grid h-8 w-8 place-items-center rounded-lg hover:bg-[var(--color-fill-2)] disabled:cursor-not-allowed disabled:text-[var(--color-faint)]"
                  aria-label="+"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={onAdd}
                disabled={soldOut || atMax}
                title={atMax ? `${maxQty} ${unitName}` : undefined}
                className={`flex h-10 min-w-10 flex-1 items-center justify-center gap-1.5 rounded-xl text-[14px] font-semibold transition ${
                  soldOut || atMax ? "cursor-not-allowed border border-[var(--color-line)] text-[var(--color-faint)]" : justAdded ? "bg-[var(--color-leaf)] text-white" : "btn-primary"
                }`}
                aria-label={dict.shop.addToCart}
              >
                {justAdded ? (
                  <Check size={17} />
                ) : (
                  <>
                    <ShoppingCart size={17} className="shrink-0" />
                    <span className="hidden truncate @[210px]:inline">{dict.shop.addToCart}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
