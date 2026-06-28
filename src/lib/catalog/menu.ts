export const MARKETS = [
  { id: 'us', locale: 'en', currencyLabel: '$ USD', countryLabel: 'United States' },
  { id: 'br', locale: 'pt', currencyLabel: 'R$ BRL', countryLabel: 'Brazil' },
] as const;

export type MarketId = (typeof MARKETS)[number]['id'];

export function getLocaleFromPathname(pathname: string): string | undefined {
  const segment = pathname.split('/').filter(Boolean)[0];
  return MARKETS.find((market) => market.locale === segment)?.locale;
}

export function replaceLocaleInPath(pathname: string, nextLocale: string): string {
  const segments = pathname.split('/');
  const first = segments[1];
  if (first && MARKETS.some((market) => market.locale === first)) {
    segments[1] = nextLocale;
    const next = segments.join('/') || `/${nextLocale}`;
    return next.startsWith('/') ? next : `/${next}`;
  }
  return `/${nextLocale}`;
}

// ponytail: self-check for locale path swap; upgrade path: vitest if this grows
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  const ok =
    replaceLocaleInPath('/pt/collections/all', 'en') === '/en/collections/all' &&
    replaceLocaleInPath('/en/collections/all', 'pt') === '/pt/collections/all' &&
    replaceLocaleInPath('/pt', 'en') === '/en';
  if (!ok) console.error('[menu] replaceLocaleInPath self-check failed');
}

export const MAIN_NAV = [
  { label: 'New Arrivals', href: 'collections/new' },
  { label: 'All', href: 'collections/all' },
  { label: 'Women', href: 'collections/women' },
  { label: 'Swimwear', href: 'collections/swimwear' },
  { label: 'Ready-to-Wear', href: 'collections/ready-to-wear' },
  { label: 'Collections', href: 'collections/collections' },
  { label: 'Accessories', href: 'collections/accessories' },
  { label: 'About', href: 'about' },
  { label: 'Sale', href: 'collections/all', sale: true },
] as const;

export const MENU_SECTIONS = {
  products: {
    label: 'Shop',
    links: [
      { label: 'New Arrivals', href: 'collections/new', chevron: true },
      { label: 'All', href: 'collections/all', chevron: true },
      { label: 'Women', href: 'collections/women', chevron: true },
      { label: 'Swimwear', href: 'collections/swimwear' },
      { label: 'Ready-to-Wear', href: 'collections/ready-to-wear' },
      { label: 'Collections', href: 'collections/collections' },
      { label: 'Accessories', href: 'collections/accessories' },
    ],
  },
  brand: {
    label: 'Our brand',
    links: [
      { label: 'About', href: 'about' },
      { label: 'Locations', href: 'locations' },
    ],
  },
  utility: [
    { label: "FAQ's", href: 'faq' },
    { label: 'Contact', href: 'contact' },
    { label: 'Newsroom', href: 'newsroom' },
  ],
  utilityMobile: [
    { label: 'Search', href: 'search' },
    { label: 'Account', href: 'account' },
    { label: 'Wishlist', href: 'account' },
  ],
} as const;
