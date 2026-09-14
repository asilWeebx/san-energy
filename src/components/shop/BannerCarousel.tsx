"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface Slide {
  image: string;
  title?: string;
  subtitle?: string;
  href?: string;
  cta?: string;
}

export function BannerCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 5500);
    return () => clearInterval(t);
  }, [n]);

  if (n === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--color-line)]">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {slides.map((s, idx) => {
          const body = (
            <div className="relative aspect-[16/7] min-h-[220px] w-full shrink-0 basis-full sm:aspect-[16/6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt={s.title || "banner"} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              {(s.title || s.subtitle) && (
                <div className="relative z-10 flex h-full max-w-[85%] flex-col justify-center gap-2 p-6 sm:max-w-[60%] sm:p-10">
                  {s.title && <h2 className="text-[clamp(22px,4vw,40px)] font-semibold leading-tight text-white">{s.title}</h2>}
                  {s.subtitle && <p className="text-[14px] text-white/85 sm:text-[16px]">{s.subtitle}</p>}
                  {s.href && s.cta && (
                    <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-sm font-bold text-white">
                      {s.cta} <ArrowRight size={16} />
                    </span>
                  )}
                </div>
              )}
            </div>
          );
          return s.href ? (
            <Link key={idx} href={s.href} className="min-w-0 shrink-0 basis-full">{body}</Link>
          ) : (
            <div key={idx} className="min-w-0 shrink-0 basis-full">{body}</div>
          );
        })}
      </div>

      {n > 1 && (
        <>
          {/* dots — bottom center */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
          {/* arrows — grouped bottom-right */}
          <div className="absolute bottom-4 right-4 z-20 flex gap-2">
            <button onClick={() => go(-1)} aria-label="prev"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#161616] shadow-md backdrop-blur transition hover:bg-white">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => go(1)} aria-label="next"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#161616] shadow-md backdrop-blur transition hover:bg-white">
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
