import { m } from '@/lib/i18n';

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

export function getMainNav(locale: string) {
  const n = m(locale).nav;
  return [
    { label: n.newArrivals, href: 'collections/new' },
    { label: n.all, href: 'collections/all' },
    { label: n.women, href: 'collections/women' },
    { label: n.swimwear, href: 'collections/swimwear' },
    { label: n.readyToWear, href: 'collections/ready-to-wear' },
    { label: n.collections, href: 'collections/collections' },
    { label: n.accessories, href: 'collections/accessories' },
    { label: n.about, href: 'about' },
    { label: n.sale, href: 'collections/all', sale: true },
  ] as const;
}

export function getMenuSections(locale: string) {
  const n = m(locale).nav;
  return {
    products: {
      label: n.shop,
      links: [
        { label: n.newArrivals, href: 'collections/new', chevron: true },
        { label: n.all, href: 'collections/all', chevron: true },
        { label: n.women, href: 'collections/women', chevron: true },
        { label: n.swimwear, href: 'collections/swimwear' },
        { label: n.readyToWear, href: 'collections/ready-to-wear' },
        { label: n.collections, href: 'collections/collections' },
        { label: n.accessories, href: 'collections/accessories' },
      ],
    },
    brand: {
      label: n.ourBrand,
      links: [
        { label: n.about, href: 'about' },
        { label: n.locations, href: 'locations' },
      ],
    },
    utility: [
      { label: n.faqs, href: 'faq' },
      { label: n.contact, href: 'contact' },
      { label: n.newsroom, href: 'newsroom' },
    ],
    utilityMobile: [
      { label: n.search, href: 'search' },
      { label: n.account, href: 'account' },
      { label: n.wishlist, href: 'wishlist' },
    ],
  };
}

/** @deprecated use getMainNav(locale) */
export const MAIN_NAV = getMainNav('en');

/** @deprecated use getMenuSections(locale) */
export const MENU_SECTIONS = getMenuSections('en');

// ponytail: self-check for locale path swap
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  const ok =
    replaceLocaleInPath('/pt/collections/all', 'en') === '/en/collections/all' &&
    replaceLocaleInPath('/en/collections/all', 'pt') === '/pt/collections/all' &&
    replaceLocaleInPath('/pt', 'en') === '/en';
  if (!ok) console.error('[menu] replaceLocaleInPath self-check failed');
}
