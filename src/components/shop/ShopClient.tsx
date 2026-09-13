"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, PackageOpen, Loader2, Flame, BadgePercent } from "lucide-react";
import type { Product } from "@/lib/shop/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { useShopData } from "./ShopDataProvider";
import { useCart } from "@/components/providers/CartProvider";
import { ProductCard } from "./ProductCard";
import { ProductRow } from "./ProductRow";
import { BannerCarousel, type Slide } from "./BannerCarousel";

const FALLBACK_IMAGES = ["/img/hero-sprinkler.jpg", "/img/drip-rows.jpg", "/img/pump-station.png"];

interface Cat {
  id: number;
  name: string;
  parentId: number | null;
}

export function ShopClient({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { info, products, topIds, byId, showStock, baseLabel, loading, error } = useShopData();
  const { count } = useCart();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const q = search.trim().toLowerCase();

  const slides: Slide[] = useMemo(() => {
    const banners = info?.banners || [];
    if (banners.length > 0) return banners.map((b) => ({ image: b.image, title: b.title }));
    return [
      { image: FALLBACK_IMAGES[0], title: dict.shop.title, subtitle: dict.shop.subtitle },
      { image: FALLBACK_IMAGES[1], title: dict.services.drip.title, subtitle: dict.brand.descriptor },
      { image: FALLBACK_IMAGES[2], title: dict.services.hydro.title, subtitle: dict.brand.city },
    ];
  }, [info, dict]);

  // build category tree (leaf + parent), like dukonline-demo
  const cats = useMemo(() => {
    const map = new Map<number, Cat>();
    for (const p of products) {
      if (p.category_id && p.category_name)
        map.set(p.category_id, { id: p.category_id, name: p.category_name, parentId: p.category_parent_id || null });
      if (p.category_parent_id && p.category_parent_name && !map.has(p.category_parent_id))
        map.set(p.category_parent_id, { id: p.category_parent_id, name: p.category_parent_name, parentId: null });
    }
    return [...map.values()];
  }, [products]);
  const topCats = useMemo(() => cats.filter((c) => !c.parentId), [cats]);

  const topProducts = useMemo(
    () => topIds.map((id) => byId.get(id)).filter(Boolean) as Product[],
    [topIds, byId]
  );
  const discounted = useMemo(() => products.filter((p) => p.discount_percent > 0), [products]);

  const filtered = useMemo(
    () => products.filter((p) => !q || p.name.toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q)),
    [products, q]
  );

  // group by top category (only when not searching)
  const groupedSections = useMemo(() => {
    if (q || topCats.length === 0) return null;
    const byCat = new Map<number, Product[]>(topCats.map((c) => [c.id, []]));
    for (const p of filtered) {
      const topId = p.category_parent_id || p.category_id;
      if (topId && byCat.has(topId)) byCat.get(topId)!.push(p);
    }
    return topCats.map((c) => ({ cat: c, items: byCat.get(c.id) || [] })).filter((g) => g.items.length > 0);
  }, [filtered, topCats, q]);

  const displayActiveCat = activeCat || (topCats[0] ? String(topCats[0].id) : null);

  // scroll-spy: highlight the category whose section is in view
  useEffect(() => {
    if (!groupedSections || groupedSections.length === 0) return;
    const els = groupedSections.map((g) => sectionRefs.current[g.cat.id]).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveCat((e.target as HTMLElement).dataset.catId || null);
        });
      },
      { rootMargin: "-160px 0px -70% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [groupedSections]);

  function goToCat(id: number) {
    setActiveCat(String(id));
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const grid = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <>
      {/* header band */}
      <section className="relative overflow-hidden pb-6 pt-10 sm:pt-14">
        <div className="glow" style={{ width: 420, height: 420, background: "rgba(255,23,71,.14)", top: -160, right: -100 }} />
        <div className="container-x relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">{info?.organization || dict.brand.name}</span>
            <h1 className="mt-3 text-[clamp(28px,5vw,46px)] font-semibold">{dict.shop.title}</h1>
          </div>
          <Link href={`/${locale}/shop/cart`} className="btn btn-ghost btn-sm">
            <ShoppingCart size={18} /> {dict.shop.viewCart}
            {count > 0 && (
              <span className="ml-1 grid h-6 min-w-6 place-items-center rounded-full bg-[var(--color-accent)] px-1.5 text-xs font-bold text-white">{count}</span>
            )}
          </Link>
        </div>
      </section>

      {!loading && !error && (
        <div className="container-x">
          <BannerCarousel slides={slides} />
        </div>
      )}

      {/* sticky toolbar: search + centered category chips */}
      <section className="sticky top-[72px] z-30 mt-6 border-y border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-xl">
        <div className="container-x flex flex-col gap-3 py-3.5">
          <div className="relative mx-auto w-full max-w-xl">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-faint)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={dict.shop.search}
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-1)] py-3 pl-11 pr-4 text-[15px] outline-none transition focus:border-[var(--color-accent)]"
            />
          </div>
          {!q && topCats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {topCats.map((c) => {
                const on = displayActiveCat === String(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => goToCat(c.id)}
                    className={`shrink-0 whitespace-nowrap rounded-xl border px-4 py-2 text-[13px] font-semibold transition ${
                      on
                        ? "border-transparent bg-[var(--color-ink)] text-[var(--color-bg)]"
                        : "border-[var(--color-line)] bg-[var(--color-bg-elev)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* content */}
      <section className="pb-20 pt-8">
        <div className="container-x">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-[var(--color-muted)]">
              <Loader2 size={30} className="animate-spin text-[var(--color-accent)]" /> {dict.shop.loading}
            </div>
          ) : error ? (
            <div className="py-24 text-center text-[var(--color-muted)]">{dict.shop.loadError}</div>
          ) : q ? (
            /* search results — flat grid */
            <>
              <h2 className="mb-5 text-[20px] font-semibold">
                {filtered.length} <span className="font-normal text-[var(--color-faint)]">{dict.shop.results}</span>
              </h2>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-[var(--color-muted)]">
                  <PackageOpen size={40} strokeWidth={1.3} /> {dict.shop.empty}
                </div>
              ) : (
                <div className={grid}>
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} dict={dict} locale={locale} baseLabel={baseLabel} showStock={showStock} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <ProductRow title={dict.shop.topProducts} icon={<Flame size={20} />} badge={dict.shop.topBadge}
                products={topProducts.length ? topProducts : products.slice(0, 10)}
                dict={dict} locale={locale} baseLabel={baseLabel} showStock={showStock} />
              <ProductRow title={dict.shop.discounted} icon={<BadgePercent size={20} />}
                products={discounted} dict={dict} locale={locale} baseLabel={baseLabel} showStock={showStock} />

              {/* grouped-by-category sections */}
              {groupedSections && groupedSections.length > 0 ? (
                <div className="mt-4 flex flex-col gap-14">
                  {groupedSections.map((g) => (
                    <section
                      key={g.cat.id}
                      data-cat-id={g.cat.id}
                      ref={(el) => { sectionRefs.current[g.cat.id] = el; }}
                      style={{ scrollMarginTop: 168 }}
                    >
                      <h2 className="mb-5 text-[22px] font-semibold">{g.cat.name}</h2>
                      <div className={grid}>
                        {g.items.map((p) => (
                          <ProductCard key={p.id} product={p} dict={dict} locale={locale} baseLabel={baseLabel} showStock={showStock} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className={`mt-10 ${grid}`}>
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} dict={dict} locale={locale} baseLabel={baseLabel} showStock={showStock} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
