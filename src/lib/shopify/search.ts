import { getCachedOrFetch } from '@/lib/cache/stampede';
import { formatPrice } from '@/lib/catalog/data';
import { searchCatalogProducts } from '@/lib/catalog/catalog';
import { getShopifyClient, isShopifyConfigured } from '@/lib/shopify/client';
import { SEARCH_PRODUCTS } from '@/lib/shopify/queries';

interface LuxuryMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

interface SearchVariant {
  id: string;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
}

export interface SearchResult {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  tags: string[];
  images: { nodes: Array<{ url: string; altText: string | null }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants?: { nodes: SearchVariant[] };
  metafields?: LuxuryMetafield[];
}

interface SearchResponse {
  search: {
    nodes: SearchResult[];
  };
}

export interface SearchResultFormatted {
  id: string;
  title: string;
  handle: string;
  image: string | null;
  hoverImage: string | null;
  price: string;
  compareAtPrice: string | null;
  onSale: boolean;
}

function formatMoney(amount: string, currencyCode: string, locale: string) {
  return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function formatSearchResult(product: SearchResult, locale: string): SearchResultFormatted {
  const variant = product.variants?.nodes?.[0];
  const currency = variant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode;
  const priceAmount = variant?.price.amount ?? product.priceRange.minVariantPrice.amount;
  const compareAmount = variant?.compareAtPrice?.amount ?? null;
  const onSale = compareAmount !== null && Number(compareAmount) > Number(priceAmount);

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    image: product.images?.nodes?.[0]?.url ?? null,
    hoverImage: product.images?.nodes?.[1]?.url ?? null,
    price: formatMoney(priceAmount, currency, locale),
    compareAtPrice: onSale && compareAmount ? formatMoney(compareAmount, currency, locale) : null,
    onSale,
  };
}

export async function searchProducts(
  query: string,
  locale: string,
  first = 20
): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cacheKey = `search:${locale}:${query.trim().substring(0, 200).toLowerCase()}:${first}`;
  const client = getShopifyClient(locale);

  return getCachedOrFetch<SearchResult[]>(cacheKey, async () => {
    const data = await client.execute<SearchResponse>(SEARCH_PRODUCTS, {
      query: query.trim(),
      first,
    });
    return data?.search?.nodes ?? [];
  }, 300);
}

export async function searchProductsFormatted(
  query: string,
  locale: string,
  first = 20
): Promise<SearchResultFormatted[]> {
  const results = await searchProducts(query, locale, first);
  return results.map((product) => formatSearchResult(product, locale));
}

function catalogFallbackResults(query: string, first: number): SearchResultFormatted[] {
  return searchCatalogProducts(query, first).map((product) => ({
    id: product.handle,
    title: product.title,
    handle: product.handle,
    image: product.image,
    hoverImage: product.hoverImage ?? null,
    price: product.price.startsWith('$') ? product.price : formatPrice(product.price),
    compareAtPrice: product.compareAtPrice ?? null,
    onSale: Boolean(product.compareAtPrice),
  }));
}

/** Shopify first; static catalog when empty or unavailable. */
export async function searchProductsWithFallback(
  query: string,
  locale: string,
  first = 6
): Promise<SearchResultFormatted[]> {
  if (isShopifyConfigured(locale)) {
    try {
      const results = await searchProductsFormatted(query, locale, first);
      if (results.length > 0) return results;
    } catch {
      // ponytail: fall through to static catalog
    }
  }
  return catalogFallbackResults(query, first);
}

export interface SearchResultEnriched extends SearchResult {
  formattedPrice: string;
}

export async function searchProductsWithFormatting(
  query: string,
  locale: string,
  first = 20
): Promise<SearchResultEnriched[]> {
  const results = await searchProducts(query, locale, first);
  const localeFormat = locale === 'pt' ? 'pt-BR' : 'en-US';

  return results.map((product) => ({
    ...product,
    formattedPrice: new Intl.NumberFormat(localeFormat, {
      style: 'currency',
      currency:
        locale === 'pt' ? 'BRL' : (product.priceRange.minVariantPrice.currencyCode ?? 'USD'),
    }).format(Number(product.priceRange.minVariantPrice.amount)),
  }));
}
