import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ShopDataProvider } from "@/components/shop/ShopDataProvider";

export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const d = getDictionary(isLocale(locale) ? (locale as Locale) : "ru");
  return <ShopDataProvider somLabel={d.common.som}>{children}</ShopDataProvider>;
}
