import {
  BESTSELLERS,
  CATEGORIES,
  CYCLER_PRODUCTS,
  SITE_IMAGES,
  NEW_ARRIVALS,
  POPULAR_PRODUCTS,
  SEARCH_MODAL_PRODUCTS,
  type CatalogProduct,
} from '@/lib/catalog/data';

export interface CatalogCollection {
  title: string;
  description: string;
  handle: string;
  image?: string;
  products: CatalogProduct[];
}

const COLLECTION_OVERRIDES: Record<
  string,
  { title: string; description: string; image?: string; products?: CatalogProduct[] }
> = {
  all: { title: 'Shop All', description: 'Everyday essentials, refined for everyone.' },
  women: {
    title: 'Women',
    description: 'Sculpted silhouettes and quiet luxury for every day.',
    image: SITE_IMAGES.collectionWomen,
  },
  new: {
    title: 'New',
    description: 'Latest arrivals from the studio.',
    image: SITE_IMAGES.collectionNew,
    products: NEW_ARRIVALS,
  },
};

function uniqueProducts(products: CatalogProduct[]): CatalogProduct[] {
  const seen = new Set<string>();
  return products.filter((p) => {
    if (seen.has(p.handle)) return false;
    seen.add(p.handle);
    return true;
  });
}

const CURATED_SEARCH_TRIGGERS = [
  'denim',
  'jean',
  'jeans',
  'women',
  'new',
  'sale',
  'all',
] as const;

function matchesCuratedSearch(query: string): boolean {
  const q = query.trim().toLowerCase();
  // ponytail: no term.includes(q) — partial prefixes like "lu" must not dump the full curated set
  return CURATED_SEARCH_TRIGGERS.some((term) => q === term || q.includes(term));
}

export function getAllCatalogProducts(): CatalogProduct[] {
  return uniqueProducts([
    ...SEARCH_MODAL_PRODUCTS,
    ...POPULAR_PRODUCTS,
    ...NEW_ARRIVALS,
    ...BESTSELLERS,
    ...CYCLER_PRODUCTS,
  ]);
}

export function getCatalogProductByHandle(handle: string): CatalogProduct | null {
  return getAllCatalogProducts().find((p) => p.handle === handle) ?? null;
}

/** ponytail: local catalog fallback when Shopify search is empty/unavailable */
export function searchCatalogProducts(query: string, first = 6): CatalogProduct[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  if (matchesCuratedSearch(q)) {
    if (q.includes('sale')) {
      return [
        ...SEARCH_MODAL_PRODUCTS.filter((p) => p.compareAtPrice),
        ...SEARCH_MODAL_PRODUCTS.filter((p) => !p.compareAtPrice),
      ].slice(0, first);
    }
    return SEARCH_MODAL_PRODUCTS.slice(0, first);
  }

  const singular = q.endsWith('s') && q.length > 3 ? q.slice(0, -1) : q;
  return getAllCatalogProducts()
    .filter((p) => {
      const title = p.title.toLowerCase();
      const category = p.category.toLowerCase();
      const handle = p.handle.toLowerCase();
      return (
        title.includes(q) ||
        category.includes(q) ||
        handle.includes(q) ||
        title.includes(singular) ||
        category.includes(singular)
      );
    })
    .slice(0, first);
}

function matchesCategoryHandle(product: CatalogProduct, handle: string): boolean {
  const category = product.category.toLowerCase();
  if (handle === 'bags') {
    return category === 'bags' || product.title.toLowerCase().includes('bag');
  }
  if (handle === 'bracelets') return category === 'bracelets';
  if (handle === 'accessories') return category === 'accessories';
  return false;
}

export function getCatalogCollection(handle: string): CatalogCollection | null {
  const override = COLLECTION_OVERRIDES[handle];
  const category = CATEGORIES.find((c) => c.handle === handle);

  if (!override && !category) return null;

  const products =
    override?.products ??
    (handle === 'all' || handle === 'women'
      ? getAllCatalogProducts()
      : category
        ? getAllCatalogProducts().filter((p) => matchesCategoryHandle(p, handle))
        : []);

  return {
    handle,
    title: override?.title ?? category!.title,
    description: override?.description ?? category!.description,
    image: override?.image,
    products,
  };
}
