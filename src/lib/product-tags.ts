import {
  BESTSELLERS,
  NEW_ARRIVALS,
  POPULAR_PRODUCTS,
  type CatalogProduct,
} from '@/lib/catalog/data';

export type ProductTagKey = 'newArrival' | 'soldOut' | 'sale' | 'bestseller';

export const NEW_ARRIVAL_DAYS = 30;

export const STATIC_NEW_ARRIVAL_HANDLES = new Set(NEW_ARRIVALS.map((p) => p.handle));
export const STATIC_BESTSELLER_HANDLES = new Set([
  ...BESTSELLERS.map((p) => p.handle),
  ...POPULAR_PRODUCTS.map((p) => p.handle),
]);

const TAG_ALIASES: Record<ProductTagKey, string[]> = {
  newArrival: ['new-arrival', 'new arrival', 'newarrival', 'novidade', 'novidades'],
  soldOut: ['sold-out', 'out-of-stock', 'esgotado'],
  sale: ['sale', 'promo', 'promotion', 'promoção', 'promocao'],
  bestseller: ['bestseller', 'best-seller', 'best seller', 'mais-vendidos', 'most-popular', 'most popular'],
};

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function hasShopifyTag(tags: string[] | undefined, key: ProductTagKey): boolean {
  if (!tags?.length) return false;
  const aliases = new Set(TAG_ALIASES[key]);
  return tags.some((tag) => aliases.has(normalizeTag(tag)));
}

function isWithinNewArrivalWindow(publishedAt: string | null | undefined): boolean {
  if (!publishedAt) return false;
  const published = new Date(publishedAt).getTime();
  if (Number.isNaN(published)) return false;
  const cutoff = Date.now() - NEW_ARRIVAL_DAYS * 24 * 60 * 60 * 1000;
  return published >= cutoff;
}

function isOnSale(price: string | number, compareAtPrice: string | number | null | undefined): boolean {
  if (compareAtPrice == null || compareAtPrice === '') return false;
  return Number(compareAtPrice) > Number(price);
}

function isSoldOut(availableForSale: boolean | undefined, totalInventory: number | null | undefined): boolean {
  if (availableForSale === false) return true;
  if (totalInventory != null && totalInventory <= 0) return true;
  return false;
}

export interface ShopifyProductTagInput {
  handle: string;
  tags?: string[];
  publishedAt?: string | null;
  totalInventory?: number | null;
  variants?: {
    nodes: Array<{
      availableForSale?: boolean;
      price?: { amount: string };
      compareAtPrice?: { amount: string } | null;
    }>;
  };
  priceRange?: { minVariantPrice: { amount: string } };
}

export interface ProductTagOptions {
  bestsellerHandles?: Set<string>;
}

export function resolveShopifyProductTags(
  product: ShopifyProductTagInput,
  options: ProductTagOptions = {}
): ProductTagKey[] {
  const variant = product.variants?.nodes?.[0];
  const price = variant?.price?.amount ?? product.priceRange?.minVariantPrice.amount ?? '0';
  const compareAtPrice = variant?.compareAtPrice?.amount ?? null;
  const bestsellerHandles = options.bestsellerHandles ?? STATIC_BESTSELLER_HANDLES;

  const tags: ProductTagKey[] = [];

  if (
    isSoldOut(variant?.availableForSale, product.totalInventory) ||
    hasShopifyTag(product.tags, 'soldOut')
  ) {
    tags.push('soldOut');
  }

  if (isOnSale(price, compareAtPrice) || hasShopifyTag(product.tags, 'sale')) {
    tags.push('sale');
  }

  if (
    isWithinNewArrivalWindow(product.publishedAt) ||
    hasShopifyTag(product.tags, 'newArrival') ||
    STATIC_NEW_ARRIVAL_HANDLES.has(product.handle)
  ) {
    tags.push('newArrival');
  }

  if (hasShopifyTag(product.tags, 'bestseller') || bestsellerHandles.has(product.handle)) {
    tags.push('bestseller');
  }

  return tags;
}

export function resolveCatalogProductTags(product: CatalogProduct): ProductTagKey[] {
  const tags: ProductTagKey[] = [];

  if (product.soldOut) tags.push('soldOut');
  if (product.compareAtPrice) tags.push('sale');
  if (STATIC_NEW_ARRIVAL_HANDLES.has(product.handle)) tags.push('newArrival');
  if (STATIC_BESTSELLER_HANDLES.has(product.handle)) tags.push('bestseller');

  return tags;
}

// ponytail: dev-only sanity check; upgrade path: vitest if tag rules grow
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  const saleTags = resolveCatalogProductTags({
    title: 'x',
    category: 'y',
    price: '€ 100',
    handle: 'denim-cargo-jean',
    image: '/x.jpg',
    compareAtPrice: '€ 200',
  });
  const newTags = resolveCatalogProductTags(NEW_ARRIVALS[0]!);
  if (!saleTags.includes('sale') || !newTags.includes('newArrival')) {
    console.error('[product-tags] resolveCatalogProductTags self-check failed');
  }
}
