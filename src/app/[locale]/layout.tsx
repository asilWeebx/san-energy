import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LangSetter } from "@/components/ui/LangSetter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  return (
    <div className="flex min-h-screen flex-col">
      <LangSetter locale={locale} />
      <Header locale={locale as Locale} dict={dict} />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer locale={locale as Locale} dict={dict} />
    </div>
  );
}
