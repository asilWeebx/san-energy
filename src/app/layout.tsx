import type { Metadata } from "next";
import { Oswald, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/CartProvider";
import { CustomerProvider } from "@/components/providers/CustomerProvider";

const oswald = Oswald({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const jb = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "700"],
  variable: "--font-jb",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://san-hydro.uz"),
  title: {
    default: "SAN HYDRO ENERGY — Капельное орошение и Мини ГЭС",
    template: "%s — SAN HYDRO ENERGY",
  },
  description:
    "Инженерные решения: капельное орошение хлопка и мини гидроэлектростанции. Проектирование, поставка, монтаж и сервис. Гулистан, Узбекистан.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "SAN HYDRO ENERGY",
    description: "Капельное орошение и мини гидроэнергетика в Узбекистане.",
    images: ["/img/logo-full.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${oswald.variable} ${manrope.variable} ${jb.variable}`}>
      <body suppressHydrationWarning>
        <CustomerProvider>
          <CartProvider>{children}</CartProvider>
        </CustomerProvider>
      </body>
    </html>
  );
}
