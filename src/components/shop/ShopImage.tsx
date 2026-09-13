"use client";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

/**
 * Product/category image with a graceful fallback.
 * If the src is empty or fails to load, a clean placeholder icon is shown
 * instead of a broken-image glyph.
 */
export function ShopImage({
  src,
  alt,
  className = "",
  iconSize = 38,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  iconSize?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="grid h-full w-full place-items-center text-[var(--color-faint)]">
        <ImageIcon size={iconSize} strokeWidth={1.3} />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
