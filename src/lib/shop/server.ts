const BASE = process.env.STOREFRONT_API_BASE || "https://api.dukonline.uz/api";
const KEY = process.env.STOREFRONT_KEY || "";

/**
 * Server-side fetch to the DukOnline storefront API.
 * The storefront key never reaches the browser — every shop request is
 * proxied through Next.js route handlers that call this.
 */
export async function sfFetch(
  path: string,
  init?: RequestInit & { revalidate?: number }
): Promise<Response> {
  const url = `${BASE}${path}`;
  const { revalidate, ...rest } = init || {};
  return fetch(url, {
    ...rest,
    headers: {
      "X-Storefront-Key": KEY,
      "Content-Type": "application/json",
      ...(rest.headers || {}),
    },
    // default: no cache for dynamic data unless caller opts in
    cache: rest.cache ?? "no-store",
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  });
}

export function storefrontConfigured(): boolean {
  return Boolean(KEY);
}

/** Host that serves media (API base minus the trailing /api). */
export function mediaHost(): string {
  return BASE.replace(/\/api\/?$/, "");
}

/** Turn a relative /media/... path into an absolute URL on the API host. */
export function absMedia<T>(u: T): T {
  if (typeof u !== "string" || !u) return u;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return (mediaHost() + u) as unknown as T;
  return u;
}
