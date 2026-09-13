import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale as Locale);
  const pid = Number(id);
  if (!Number.isFinite(pid)) notFound();
  return <ProductDetailClient id={pid} dict={d} locale={locale as Locale} />;
}
