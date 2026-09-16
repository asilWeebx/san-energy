"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Minus,
  Plus,
  Check,
  ShoppingCart,
  PackageCheck,
  PackageX,
  Loader2,
  Zap,
} from "lucide-react";
import type { CartLine, Product } from "@/lib/shop/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { useShopData } from "./ShopDataProvider";
import { useCart } from "@/components/providers/CartProvider";
import { ProductRow } from "./ProductRow";
import { ShopImage } from "./ShopImage";
import { QtyInput } from "./QtyInput";
import { money, origFrom } from "@/lib/format";

export function ProductDetailClient({
  id,
  dict,
  locale,
}: {
  id: number;
  dict: Dictionary;
  locale: Locale;
}) {
  const router = useRouter();
  const { products, byId, baseLabel, showStock, loading } = useShopData();
  const { add, lines } = useCart();
  const product = byId.get(id);

  const variants = product?.variants || [];
  const units = product?.units || [];
  const [variantId, setVariantId] = useState<number | null>(
    variants.find((v) => v.in_stock)?.id ?? variants[0]?.id ?? null
  );
  const [unitId, setUnitId] = useState<number | null>(units[0]?.unit_id ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const current = useMemo(() => {
    if (!product) return null;
    if (product.has_variants) {
      const v = variants.find((x) => x.id === variantId) ?? variants[0];
      return v && { cur: v.cur_price, curr: v.currency, orig: v.cur_original_price, inStock: v.in_stock, stock: v.stock, variantId: v.id, unitId: undefined as number | undefined, price: v.price, name: v.name };
    }
    const u = units.find((x) => x.unit_id === unitId) ?? units[0];
    return u
      ? { cur: u.cur_price, curr: u.currency, orig: u.cur_original_price, inStock: product.in_stock, stock: product.stock, variantId: undefined as number | undefined, unitId: u.unit_id ?? undefined, price: u.price, name: u.unit_name }
      : { cur: 0, curr: "", orig: null, inStock: product.in_stock, stock: product.stock, variantId: undefined, unitId: undefined, price: 0, name: "" };
  }, [product, variants, units, variantId, unitId]);

  const similar = useMemo(() => {
    if (!product) return [] as Product[];
    return products
      .filter((p) => p.id !== product.id && p.category_id && p.category_id === product.category_id)
      .slice(0, 10);
  }, [products, product]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={30} className="animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }
  if (!product || !current) {
    return (
      <div className="container-x flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center text-[var(--color-muted)]">
        {dict.shop.empty}
        <Link href={`/${locale}/shop`} className="btn btn-primary"><ChevronLeft size={17} /> {dict.cart.backToShop}</Link>
      </div>
    );
  }

  const key = `${product.id}:${current.variantId ?? ""}:${current.unitId ?? ""}`;
  const inCart = lines.find((l) => l.key === key)?.qty ?? 0;
  const soldOut = showStock && !current.inStock;

  const selUnitMult = product.has_variants ? 1 : (units.find((u) => u.unit_id === unitId)?.multiplier ?? 1);
  const isTrackedD = product.has_variants ? current.stock != null : product.stock_type === "tracked";
  const stockNum = product.has_variants ? current.stock : product.stock;
  const maxQtyD = isTrackedD && stockNum != null
    ? (product.has_variants ? Math.floor(stockNum) : Math.floor(stockNum / selUnitMult))
    : Infinity;
  const cappedD = Number.isFinite(maxQtyD);
  const remaining = cappedD ? Math.max(0, maxQtyD - inCart) : Infinity;
  const canAdd = !soldOut && (!cappedD || remaining > 0);
  const detailOrig = origFrom(current.cur, current.orig, product.discount_percent);

  function buildLine(): CartLine {
    return {
      key,
      product_id: product!.id,
      variant_id: current!.variantId,
      unit_id: current!.unitId,
      name: product!.name,
      variant_name: current!.variantId ? current!.name : undefined,
      image: product!.image,
      qty,
      price: current!.price,
      currency: current!.curr,
      cur_price: current!.cur,
      maxQty: cappedD ? maxQtyD : undefined,
    };
  }
  function onAdd() {
    if (!canAdd) return;
    add(buildLine(), Math.min(qty, remaining));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }
  function onBuyNow() {
    if (!canAdd) return;
    add(buildLine(), Math.min(qty, remaining));
    router.push(`/${locale}/shop/cart`);
  }

  return (
    <>
      <section className="section pt-6">
        <div className="container-x">
          <Link href={`/${locale}/shop`} className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)]">
            <ChevronLeft size={18} /> {dict.shop.allProducts}
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            {/* image */}
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-fill-1)]">
              <ShopImage src={product.image} alt={product.name} iconSize={56} className="h-full w-full object-cover" />
              {product.discount_percent > 0 && (
                <span className="absolute left-4 top-4 rounded-xl bg-[var(--color-accent)] px-3 py-1.5 text-sm font-bold text-white">
                  −{Math.round(product.discount_percent)}%
                </span>
              )}
            </div>

            {/* info */}
            <div>
              {product.category_name && (
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-faint)]">{product.category_name}</span>
              )}
              <h1 className="mt-2 text-[clamp(24px,3.5vw,36px)] font-semibold">{product.name}</h1>
              {product.sku && (
                <p className="mt-1.5 text-[13px] text-[var(--color-faint)]">{dict.shop.sku}: <span style={{ fontFamily: "var(--font-mono)" }}>{product.sku}</span></p>
              )}

              <div className="mt-5 flex items-end gap-3">
                <span className="text-[32px] font-bold text-[var(--color-accent-light)]" style={{ fontFamily: "var(--font-display)" }}>
                  {money(current.cur, current.curr, baseLabel)}
                </span>
                {detailOrig != null && detailOrig > current.cur && (
                  <span className="pb-1.5 text-[17px] text-[var(--color-faint)] line-through">{money(detailOrig, current.curr, baseLabel)}</span>
                )}
                {product.discount_percent > 0 && (
                  <span className="mb-1 rounded-lg bg-[var(--color-accent)] px-2 py-1 text-[13px] font-bold text-white">−{Math.round(product.discount_percent)}%</span>
                )}
              </div>

              {/* variant pills */}
              {product.has_variants && variants.length > 0 && (
                <div className="mt-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-faint)]">{dict.shop.pickVariant}</span>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {variants.map((v) => {
                      const on = v.id === variantId;
                      const off = showStock && !v.in_stock;
                      return (
                        <button key={v.id} disabled={off} onClick={() => setVariantId(v.id)}
                          className={`rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition ${
                            off ? "cursor-not-allowed border-[var(--color-line)] text-[var(--color-faint)] line-through"
                            : on ? "border-[var(--color-accent)] bg-[var(--color-accent)]/12 text-[var(--color-ink)]"
                            : "border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                          }`}>
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* unit pills */}
              {!product.has_variants && units.length > 1 && (
                <div className="mt-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-faint)]">{dict.cart.qty}</span>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {units.map((u) => {
                      const on = u.unit_id === unitId;
                      return (
                        <button key={u.unit_id ?? u.unit_name} onClick={() => setUnitId(u.unit_id ?? null)}
                          className={`rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition ${
                            on ? "border-[var(--color-accent)] bg-[var(--color-accent)]/12 text-[var(--color-ink)]" : "border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                          }`}>
                          {u.unit_name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* stock */}
              <div className="mt-5 flex flex-wrap items-center gap-3 text-[14px]">
                {soldOut ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-accent-light)]"><PackageX size={17} /> {dict.shop.outOfStock}</span>
                ) : showStock && current.stock != null ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-leaf)]"><PackageCheck size={17} /> {dict.shop.inStock}: {current.stock}</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-leaf)]"><PackageCheck size={17} /> {dict.shop.inStock}</span>
                )}
                {inCart > 0 && (
                  <span className="rounded-lg bg-[var(--color-fill-2)] px-2.5 py-1 text-[13px] text-[var(--color-silver-dim)]">{dict.cart.title}: {inCart}</span>
                )}
              </div>

              {/* qty + actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-[var(--color-line)] p-1.5">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[var(--color-fill-2)]" aria-label="-"><Minus size={16} /></button>
                  <QtyInput
                    value={qty}
                    max={cappedD ? remaining : undefined}
                    onCommit={(n) => setQty(n)}
                    className="w-11 rounded-lg px-1 py-1 text-[16px] focus:bg-[var(--color-fill-2)]"
                  />
                  <button
                    onClick={() => setQty((q) => (cappedD ? Math.min(remaining, q + 1) : q + 1))}
                    disabled={cappedD && qty >= remaining}
                    className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[var(--color-fill-2)] disabled:cursor-not-allowed disabled:text-[var(--color-faint)]"
                    aria-label="+"
                  ><Plus size={16} /></button>
                </div>
                <button onClick={onAdd} disabled={!canAdd}
                  className={`btn flex-1 ${!canAdd ? "cursor-not-allowed border border-[var(--color-line)] text-[var(--color-faint)]" : added ? "" : "btn-ghost"}`}
                  style={added ? { background: "var(--color-leaf)", color: "#fff" } : undefined}>
                  {added ? <><Check size={18} /> {dict.shop.added}</> : <><ShoppingCart size={18} /> {dict.shop.addToCart}</>}
                </button>
                <button onClick={onBuyNow} disabled={!canAdd} className="btn btn-primary flex-1 disabled:opacity-60">
                  <Zap size={17} /> {dict.shop.buyNow}
                </button>
              </div>

              {/* description */}
              <div className="mt-8 border-t border-[var(--color-line)] pt-6">
                <h3 className="text-[15px] font-semibold">{dict.shop.description}</h3>
                <p className="mt-2 whitespace-pre-line text-[14.5px] leading-relaxed text-[var(--color-muted)]">
                  {product.description?.trim() || dict.shop.noDescription}
                </p>
              </div>
            </div>
          </div>

          {/* similar */}
          <ProductRow title={dict.shop.similar} products={similar} dict={dict} locale={locale} baseLabel={baseLabel} showStock={showStock} />
        </div>
      </section>
    </>
  );
}
