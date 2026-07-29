import { getShopifyClient, isShopifyConfigured } from '@/lib/shopify/client';
import { GET_SALE_PRODUCTS } from '@/lib/shopify/queries';
import type { ShopifyProduct } from '@/lib/shopify/types';

const SALE_SEARCH_QUERIES = [
  'compare_at_price:>0',
  'tag:sale',
  'tag:promo',
  'tag:promotion',
  'tag:promocao',
  'tag:promoção',
] as const;

function mergeSaleProducts(products: ShopifyProduct[]): ShopifyProduct[] {
  const seen = new Set<string>();
  const merged: ShopifyProduct[] = [];

  for (const product of products) {
    if (seen.has(product.handle)) continue;
    seen.add(product.handle);
    merged.push(product);
  }

  return merged;
}

/** Shopify "sale" collection is often empty — discover discounted products directly. */
export async function getSaleProducts(locale: string, first = 48): Promise<ShopifyProduct[]> {
  if (!isShopifyConfigured(locale)) return [];

  const client = getShopifyClient(locale);
  const perQuery = Math.max(12, Math.ceil(first / SALE_SEARCH_QUERIES.length));
  const collected: ShopifyProduct[] = [];

  for (const query of SALE_SEARCH_QUERIES) {
    try {
      const data = await client.execute<{ products: { nodes: ShopifyProduct[] } }>(
        GET_SALE_PRODUCTS,
        { first: perQuery, query }
      );
      collected.push(...(data?.products?.nodes ?? []));
      if (mergeSaleProducts(collected).length >= first) break;
    } catch {
      // ponytail: try next sale query
    }
  }

  return mergeSaleProducts(collected).slice(0, first);
}
