// San-hydro sayt rasmlari (Django backend, alohida — DukOnline online do'kon EMAS).
// Landing shu yerdan galereya/hero/about rasmlarini oladi; admin panel yuklaydi.

export type SiteImage = {
  id: number;
  section: "gallery" | "about" | "hero" | string;
  url: string;
  title: string;
  order: number;
  is_active: boolean;
  created_at: string;
};

export const IMAGES_API =
  process.env.NEXT_PUBLIC_IMAGES_API || "http://localhost:8009";

/** Bo'lim bo'yicha faol rasmlar (server-side, 60s ISR — yangi rasm 1 daqiqada chiqadi). */
export async function getSiteImages(section?: string): Promise<SiteImage[]> {
  try {
    const u = new URL("/api/images/", IMAGES_API);
    if (section) u.searchParams.set("section", section);
    const r = await fetch(u.toString(), { next: { revalidate: 60 } });
    if (!r.ok) return [];
    return (await r.json()) as SiteImage[];
  } catch {
    return [];
  }
}
