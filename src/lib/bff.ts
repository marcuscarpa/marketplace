import { getCachedOrFetch } from '@/lib/cache/stampede';
import { getShopifyClient } from '@/lib/shopify/client';
import { parseLuxuryMetafields } from '@/lib/shopify/metafields';
import { SEARCH_PRODUCTS, GET_PRODUCT_BY_HANDLE, PRODUCT_RECOMMENDATIONS } from '@/lib/shopify/queries';
import type { ShopifyProduct, LuxuryMetafields } from '@/lib/shopify/types';

export interface EnrichedProduct extends ShopifyProduct {
  luxury: LuxuryMetafields;
  formattedPrice: string;
}

export async function fetchProductByHandle(handle: string, locale: string): Promise<EnrichedProduct | null> {
  const cacheKey = `bff:product:${locale}:${handle}`;

  return getCachedOrFetch<EnrichedProduct | null>(cacheKey, async () => {
    const client = getShopifyClient(locale);
    const data = await client.execute<{ product: ShopifyProduct | null }>(
      GET_PRODUCT_BY_HANDLE,
      { handle }
    );

    if (!data?.product) return null;

    const luxury = parseLuxuryMetafields(data.product.metafields);
    const localeFormat = locale === 'pt' ? 'pt-BR' : 'en-US';
    const currency = data.product.priceRange.minVariantPrice.currencyCode;
    const formattedPrice = new Intl.NumberFormat(localeFormat, {
      style: 'currency',
      currency,
    }).format(Number(data.product.priceRange.minVariantPrice.amount));

    return { ...data.product, options: data.product.options ?? [], luxury, formattedPrice };
  }, 300);
}

export interface SearchResult {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: { url: string; altText: string | null } | null;
  price: string;
  currency: string;
  vendor: string;
}

export async function fetchSearchResults(query: string, locale: string, first = 24): Promise<SearchResult[]> {
  const cacheKey = `bff:search:${locale}:${query}:${first}`;

  return getCachedOrFetch<SearchResult[]>(cacheKey, async () => {
    const client = getShopifyClient(locale);
    const data = await client.execute<{ search: { nodes: ShopifyProduct[] } }>(
      SEARCH_PRODUCTS,
      { query, first }
    );

    const localeFormat = locale === 'pt' ? 'pt-BR' : 'en-US';

    return (data?.search?.nodes ?? []).map((product) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      image: product.images?.nodes?.[0] ?? null,
      price: new Intl.NumberFormat(localeFormat, {
        style: 'currency',
        currency: product.priceRange.minVariantPrice.currencyCode,
      }).format(Number(product.priceRange.minVariantPrice.amount)),
      currency: product.priceRange.minVariantPrice.currencyCode,
      vendor: product.vendor ?? '',
    }));
  }, 300);
}

export interface RecommendationEnriched {
  id: string;
  title: string;
  handle: string;
  image: { url: string; altText: string | null } | null;
  formattedPrice: string;
}

export async function fetchRecommendations(productId: string, locale: string): Promise<RecommendationEnriched[]> {
  const cacheKey = `bff:recommendations:${locale}:${productId}`;

  return getCachedOrFetch<RecommendationEnriched[]>(cacheKey, async () => {
    const client = getShopifyClient(locale);
    const data = await client.execute<{ productRecommendations: ShopifyProduct[] }>(
      PRODUCT_RECOMMENDATIONS,
      { productId }
    );

    const localeFormat = locale === 'pt' ? 'pt-BR' : 'en-US';

    return (data?.productRecommendations ?? []).slice(0, 8).map((product) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      image: product.images?.nodes?.[0] ?? null,
      formattedPrice: new Intl.NumberFormat(localeFormat, {
        style: 'currency',
        currency: product.priceRange.minVariantPrice.currencyCode,
      }).format(Number(product.priceRange.minVariantPrice.amount)),
    }));
  }, 3600);
}
