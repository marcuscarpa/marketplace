import { getCachedOrFetch } from '@/lib/cache/stampede';
import { STATIC_BESTSELLER_HANDLES } from '@/lib/product-tags';
import { getShopifyClient, isShopifyConfigured } from '@/lib/shopify/client';
import { GET_COLLECTION_BY_HANDLE } from '@/lib/shopify/queries';

const BESTSELLER_COLLECTION_HANDLES = ['bestsellers', 'most-popular', 'best-sellers'] as const;

export async function getBestsellerHandles(locale: string): Promise<Set<string>> {
  if (!isShopifyConfigured(locale)) {
    return STATIC_BESTSELLER_HANDLES;
  }

  const cacheKey = `bestseller-handles:${locale}`;

  return getCachedOrFetch<Set<string>>(cacheKey, async () => {
    const client = getShopifyClient(locale);

    for (const handle of BESTSELLER_COLLECTION_HANDLES) {
      try {
        const data = await client.execute<{
          collection: { products: { nodes: Array<{ handle: string }> } } | null;
        }>(GET_COLLECTION_BY_HANDLE, { handle, first: 50 });

        const handles = data?.collection?.products?.nodes?.map((p) => p.handle) ?? [];
        if (handles.length > 0) {
          return new Set([...STATIC_BESTSELLER_HANDLES, ...handles]);
        }
      } catch {
        // ponytail: try next collection handle
      }
    }

    return STATIC_BESTSELLER_HANDLES;
  }, 3600);
}
