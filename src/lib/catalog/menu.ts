import { getStaticNavigation } from '@/lib/catalog/navigation-static';
import { m } from '@/lib/i18n';

export type { NavLink, MenuSections, SiteNavigation } from '@/lib/catalog/navigation-types';

export const MARKET_IDS = [
  { id: 'us', locale: 'en', currencyKey: 'us' as const },
  { id: 'br', locale: 'pt', currencyKey: 'br' as const },
] as const;

export type MarketId = (typeof MARKET_IDS)[number]['id'];

export function getMarkets(locale: string) {
  const markets = m(locale).markets;
  return MARKET_IDS.map((market) => ({
    id: market.id,
    locale: market.locale,
    currencyLabel: markets[market.currencyKey].currency,
    countryLabel: markets[market.currencyKey].country,
  }));
}

/** @deprecated use getMarkets(locale) */
export const MARKETS = getMarkets('en');

export function getLocaleFromPathname(pathname: string): string | undefined {
  const segment = pathname.split('/').filter(Boolean)[0];
  return MARKET_IDS.find((market) => market.locale === segment)?.locale;
}

export function replaceLocaleInPath(pathname: string, nextLocale: string): string {
  const segments = pathname.split('/');
  const first = segments[1];
  if (first && MARKET_IDS.some((market) => market.locale === first)) {
    segments[1] = nextLocale;
    const next = segments.join('/') || `/${nextLocale}`;
    return next.startsWith('/') ? next : `/${next}`;
  }
  return `/${nextLocale}`;
}

/** Sync fallback — prefer `getSiteNavigation()` from server layout. */
export function getMainNav(locale: string) {
  return getStaticNavigation(locale).mainNav;
}

/** Sync fallback — prefer `getSiteNavigation()` from server layout. */
export function getMenuSections(locale: string) {
  return getStaticNavigation(locale).menuSections;
}

/** @deprecated use getMainNav(locale) */
export const MAIN_NAV = getMainNav('en');

/** @deprecated use getMenuSections(locale) */
export const MENU_SECTIONS = getMenuSections('en');

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  const ok =
    replaceLocaleInPath('/pt/collections/shop-all', 'en') === '/en/collections/shop-all' &&
    replaceLocaleInPath('/en/collections/shop-all', 'pt') === '/pt/collections/shop-all' &&
    replaceLocaleInPath('/pt', 'en') === '/en';
  if (!ok) console.error('[menu] replaceLocaleInPath self-check failed');
}
