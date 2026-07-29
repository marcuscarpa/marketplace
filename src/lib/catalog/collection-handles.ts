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

/** Legacy storefront paths → live Shopify handles (never map a handle to itself). */
export const LEGACY_COLLECTION_REDIRECTS: Record<string, string> = {
  new: SHOPIFY_COLLECTION.newArrivals,
  all: SHOPIFY_COLLECTION.shopAll,
  women: SHOPIFY_COLLECTION.shopAll,
  'ready-to-wear': SHOPIFY_COLLECTION.readyToWear,
  collections: SHOPIFY_COLLECTION.featured,
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
