import { en, type Messages } from './messages/en';
import { pt } from './messages/pt';

export type Locale = 'en' | 'pt';

const LOCALES: Locale[] = ['en', 'pt'];

export function isPt(locale: string): boolean {
  return locale === 'pt';
}

export function localeTag(locale: string): string {
  return isPt(locale) ? 'pt-BR' : 'en';
}

export function m(locale: string): Messages {
  return isPt(locale) ? pt : en;
}

export function resolveLocale(locale: string): Locale {
  return LOCALES.includes(locale as Locale) ? (locale as Locale) : 'en';
}

export { en, pt };
export type { Messages };
