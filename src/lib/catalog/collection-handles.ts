/** Canonical Shopify collection handles for Sinesia Karol US store. */
export const SHOPIFY_COLLECTION = {
  shopAll: 'shop-all',
  newArrivals: 'new-arrivals',
  swimwear: 'swimwear',
  readyToWear: 'all-rtw',
  featured: 'orchid-collection',
  /** Virtual PLP — merges bags, shoes, hats. */
  accessories: 'accessories',
  sale: 'sale',
  bestsellers: 'bestsellers',
  women: 'shop-all',
  men: 'mens-collection',
} as const;

/** Footer menu / old URLs → live Shopify collection handles. */
export const MENU_COLLECTION_ALIASES: Record<string, string> = {
  'garden-collection': 'orchid-collection',
  'floral-print-collection': 'florias',
};

export function resolveCollectionHandle(handle: string): string {
  return MENU_COLLECTION_ALIASES[handle] ?? handle;
}

/** Legacy storefront paths → live Shopify handles (never map a handle to itself). */
export const LEGACY_COLLECTION_REDIRECTS: Record<string, string> = {
  new: SHOPIFY_COLLECTION.newArrivals,
  all: SHOPIFY_COLLECTION.shopAll,
  women: SHOPIFY_COLLECTION.shopAll,
  'ready-to-wear': SHOPIFY_COLLECTION.readyToWear,
  collections: SHOPIFY_COLLECTION.featured,
  ...MENU_COLLECTION_ALIASES,
};

export function collectionPath(handle: string): string {
  return `collections/${handle}`;
}

export function isHiddenCollectionHandle(handle: string): boolean {
  return (
    handle.startsWith('spo-filter') ||
    handle === 'onepiece' ||
    handle === 'hat'
  );
}
