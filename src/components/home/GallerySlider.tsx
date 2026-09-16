"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SiteImage } from "@/lib/siteImages";

/**
 * Bosh sahifa galereyasi — admin panelidan boshqariladigan rasmlar (section=gallery).
 * Rasmlar avtomatik almashib turadi; foydalanuvchi qo'lda ham suradi.
 * Django media (localhost:8009) — next/image emas, oddiy <img> (ixtiyoriy host).
 */
export function GallerySlider({ images }: { images: SiteImage[] }) {
  const slides = images.filter((i) => i.is_active);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const n = slides.length;
  const go = useCallback((next: number) => setIdx((c) => ((next % n) + n) % n), [n]);

  useEffect(() => {
    if (n <= 1 || paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setIdx((c) => (c + 1) % n), 4200);
    return () => clearInterval(t);
  }, [n, paused]);

  if (n === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-[var(--color-bg-elev)] shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
        touchX.current = null;
      }}
    >
      {/* rasmlar */}
      <div className="relative aspect-[16/9] w-full">
        {slides.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.id}
            src={s.url}
            alt={s.title || `Galereya ${i + 1}`}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === idx ? 1 : 0 }}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {slides[idx]?.title && (
          <div className="absolute bottom-4 left-5 right-16 text-[15px] font-semibold text-white drop-shadow">
            {slides[idx].title}
          </div>
        )}
      </div>

      {n > 1 && (
        <>
          <button
            onClick={() => go(idx - 1)}
            aria-label="Oldingi"
            className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(idx + 1)}
            aria-label="Keyingi"
            className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIdx(i)}
                aria-label={`Rasm ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === idx ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
