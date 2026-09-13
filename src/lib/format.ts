export function fmtNum(n: number): string {
  const r = Math.round((n + Number.EPSILON) * 100) / 100;
  const [int, dec] = String(r).split(".");
  const spaced = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return dec ? `${spaced},${dec}` : spaced;
}

export function currencySymbol(code: string, somLabel: string): string {
  if (!code) return somLabel;
  const c = code.toUpperCase();
  if (c === "USD") return "$";
  if (c === "UZS" || c === "SOM") return somLabel;
  if (c === "EUR") return "€";
  if (c === "RUB") return "₽";
  return code;
}

/** Format a display price using the API's cur_price + currency code. */
export function money(curPrice: number, currency: string, somLabel: string): string {
  const sym = currencySymbol(currency, somLabel);
  const isDollar = sym === "$" || sym === "€" || sym === "₽";
  return isDollar ? `${sym}${fmtNum(curPrice)}` : `${fmtNum(curPrice)} ${sym}`;
}

/**
 * Original (pre-discount) price for the strikethrough.
 * Some products (e.g. telefon) return discount_percent but a null
 * original_price — the price is already discounted — so we reconstruct
 * the original from the percent.
 */
export function origFrom(
  curPrice: number,
  curOriginal: number | null | undefined,
  pct: number
): number | null {
  if (curOriginal != null && curOriginal > curPrice) return curOriginal;
  if (pct > 0 && pct < 100 && curPrice > 0) {
    const o = Math.round(curPrice / (1 - pct / 100));
    return o > curPrice ? o : null;
  }
  return null;
}

export function shortDate(iso: string, locale: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(locale === "uz" ? "ru-RU" : locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
