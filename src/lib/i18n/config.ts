export const locales = ["uz", "uz-cyrl", "ru", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const localeNames: Record<Locale, string> = {
  uz: "O‘zbekcha",
  "uz-cyrl": "Кириллча",
  ru: "Русский",
  en: "English",
};

export const localeShort: Record<Locale, string> = {
  uz: "UZ",
  "uz-cyrl": "КР",
  ru: "RU",
  en: "EN",
};

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}
