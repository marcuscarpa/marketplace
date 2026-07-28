import { formatCartPrice, type CartLineItem } from '@/lib/cart/display';
import { SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import { getCatalogRecommendations } from '@/lib/catalog/recommendations';

import { getShopifyClient, isShopifyConfigured } from './client';
import { GET_PRODUCTS_BY_COLLECTION } from './queries';
import { getProductRecommendations } from './recommendations';

export interface CartCarouselItem {
  handle: string;
  title: string;
  image: string;
  price: string;
}

interface ShopifyProductNode {
  handle: string;
  title: string;
  images: { nodes: Array<{ url: string }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}

function toCarouselItem(
  product: {
    handle: string;
    title: string;
    images: { nodes: Array<{ url: string }> };
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  },
  locale: string
): CartCarouselItem {
  return {
    handle: product.handle,
    title: product.title,
    image: product.images.nodes[0]?.url ?? '',
    price: formatCartPrice(
      product.priceRange.minVariantPrice.amount,
      product.priceRange.minVariantPrice.currencyCode,
      locale
    ),
  };
}

async function getCollectionCarouselItems(
  locale: string,
  collectionHandle: string,
  limit: number,
  exclude: Set<string>
): Promise<CartCarouselItem[]> {
  if (!isShopifyConfigured(locale)) return [];

  try {
    const client = getShopifyClient(locale);
    const data = await client.execute<{
      collection: { products: { nodes: ShopifyProductNode[] } } | null;
    }>(
      GET_PRODUCTS_BY_COLLECTION,
      { handle: collectionHandle, first: limit + exclude.size, after: null },
      `shopify:collection-products:${collectionHandle}:${locale}`
    );

    return (data.collection?.products.nodes ?? [])
      .filter((p) => !exclude.has(p.handle))
      .slice(0, limit)
      .map((p) => toCarouselItem(p, locale));
  } catch {
    return [];
  }
}

async function getRecommendationsForProductIds(
  locale: string,
  productIds: string[],
  limit: number,
  exclude: Set<string>
): Promise<CartCarouselItem[]> {
  const settled = await Promise.allSettled(
    productIds.map((id) => getProductRecommendations(id, locale, limit + exclude.size))
  );

  const merged: CartCarouselItem[] = [];
  const seen = new Set<string>();

  for (const result of settled) {
    if (result.status !== 'fulfilled') continue;
    for (const product of result.value) {
      if (exclude.has(product.handle) || seen.has(product.handle)) continue;
      seen.add(product.handle);
      merged.push(toCarouselItem(product, locale));
      if (merged.length >= limit) return merged;
    }
  }

  return merged;
}

export async function getCartPageRecommendations(
  locale: string,
  lines: CartLineItem[],
  limit = 8
): Promise<CartCarouselItem[]> {
  const exclude = new Set(lines.map((l) => l.handle));
  const productIds = [
    ...new Set(
      lines
        .map((l) => l.productId)
        .filter((id) => id && !id.startsWith('mock-'))
    ),
  ];

  if (productIds.length > 0 && isShopifyConfigured(locale)) {
    const fromShopify = await getRecommendationsForProductIds(locale, productIds, limit, exclude);
    if (fromShopify.length > 0) return fromShopify;
  }

  const anchorHandle = lines[0]?.handle ?? '';
  const catalog = getCatalogRecommendations(anchorHandle, limit + exclude.size)
    .filter((p) => !exclude.has(p.handle))
    .slice(0, limit);
  if (catalog.length > 0) {
    return catalog.map((p) => ({
      handle: p.handle,
      title: p.title,
      image: p.image,
      price: p.price,
    }));
  }

  for (const handle of [SHOPIFY_COLLECTION.bestsellers, SHOPIFY_COLLECTION.newArrivals]) {
    const fromCollection = await getCollectionCarouselItems(locale, handle, limit, exclude);
    if (fromCollection.length > 0) return fromCollection;
  }

  return [];
}
