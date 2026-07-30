import { m } from '@/lib/i18n';
import type { ShopifyProduct } from '@/lib/shopify/types';

export interface TagFilteredCollectionConfig {
  handle: string;
  parentHandle: string;
  labelKey: 'mensShirts' | 'mensShorts' | 'mensPants' | 'mensShoes';
  matches: (product: Pick<ShopifyProduct, 'tags' | 'title'>) => boolean;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function tagValues(product: Pick<ShopifyProduct, 'tags'>): string[] {
  return (product.tags ?? []).map(normalize);
}

function hasTag(product: Pick<ShopifyProduct, 'tags'>, ...needles: string[]): boolean {
  const tags = tagValues(product);
  return needles.some((needle) => tags.some((tag) => tag.includes(needle)));
}

function titleIncludes(product: Pick<ShopifyProduct, 'title'>, ...needles: string[]): boolean {
  const title = normalize(product.title);
  return needles.some((needle) => title.includes(needle));
}

/** Virtual PLPs — filter `mens-collection` products by Shopify tags/titles. */
export const TAG_FILTERED_COLLECTIONS: TagFilteredCollectionConfig[] = [
  {
    handle: 'mens-shirts',
    parentHandle: 'mens-collection',
    labelKey: 'mensShirts',
    matches: (product) => {
      if (hasTag(product, 'shoes', 'flip flop')) return false;
      if (titleIncludes(product, 'short', 'pant') && !titleIncludes(product, 'shirt')) return false;
      return hasTag(product, 'shirt', 'knit') || titleIncludes(product, 'shirt', 'knit');
    },
  },
  {
    handle: 'mens-shorts',
    parentHandle: 'mens-collection',
    labelKey: 'mensShorts',
    matches: (product) => hasTag(product, 'short') || titleIncludes(product, 'short'),
  },
  {
    handle: 'mens-pants',
    parentHandle: 'mens-collection',
    labelKey: 'mensPants',
    matches: (product) => {
      if (hasTag(product, 'short') || titleIncludes(product, 'short')) return false;
      return hasTag(product, 'pant') || titleIncludes(product, 'pant', 'pants');
    },
  },
  {
    handle: 'mens-shoes',
    parentHandle: 'mens-collection',
    labelKey: 'mensShoes',
    matches: (product) =>
      hasTag(product, 'shoes', 'flip flop') ||
      titleIncludes(product, 'loafer', 'flip flop', 'slide', 'driver', 'tennis knit'),
  },
];

const TAG_FILTERED_BY_HANDLE = Object.fromEntries(
  TAG_FILTERED_COLLECTIONS.map((config) => [config.handle, config])
) as Record<string, TagFilteredCollectionConfig>;

export function isTagFilteredCollectionHandle(handle: string): boolean {
  return handle in TAG_FILTERED_BY_HANDLE;
}

export function getTagFilteredCollectionConfig(
  handle: string
): TagFilteredCollectionConfig | undefined {
  return TAG_FILTERED_BY_HANDLE[handle];
}

export function tagFilteredCollectionTitle(handle: string, locale: string): string | null {
  const config = getTagFilteredCollectionConfig(handle);
  if (!config) return null;
  return m(locale).nav[config.labelKey];
}

export function filterProductsForTagCollection(
  products: ShopifyProduct[],
  handle: string
): ShopifyProduct[] {
  const config = getTagFilteredCollectionConfig(handle);
  if (!config) return products;
  return products.filter((product) => config.matches(product));
}

export const MENS_SUBCOLLECTION_HANDLES = TAG_FILTERED_COLLECTIONS.map((config) => config.handle);
