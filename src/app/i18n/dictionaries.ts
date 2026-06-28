import type { Locale } from '@/lib/i18n';
import { en } from '@/lib/i18n/messages/en';
import { pt } from '@/lib/i18n/messages/pt';

const dictionaries = {
  en: () => Promise.resolve(en),
  pt: () => Promise.resolve(pt),
};

export type { Locale };

export async function getDictionary(locale: string) {
  if (locale === 'pt') return dictionaries.pt();
  return dictionaries.en();
}
