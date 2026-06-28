const dictionaries = {
  en: () => import('./locales/en.json').then((m) => m.default),
  pt: () => import('./locales/pt.json').then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;

const VALID_LOCALES = Object.keys(dictionaries) as Locale[];

export async function getDictionary(locale: string) {
  if (!VALID_LOCALES.includes(locale as Locale)) {
    console.warn(`Unsupported locale "${locale}", falling back to "en"`);
    return dictionaries.en();
  }
  return dictionaries[locale as Locale]();
}