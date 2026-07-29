import { getCachedOrFetch } from '@/lib/cache/stampede';
import { STATIC_BESTSELLER_HANDLES } from '@/lib/product-tags';
import { getShopifyClient, isShopifyConfigured } from '@/lib/shopify/client';
import { GET_COLLECTION_BY_HANDLE } from '@/lib/shopify/queries';

const BESTSELLER_COLLECTION_HANDLES = ['bestsellers', 'most-popular', 'best-sellers'] as const;
const CACHE_KEY = (locale: string) => `bestseller-handles:v2:${locale}`;

function toHandleSet(handles: unknown): Set<string> {
  if (Array.isArray(handles)) {
    return new Set(handles.filter((h): h is string => typeof h === 'string'));
  }
  return new Set(STATIC_BESTSELLER_HANDLES);
}

export async function getBestsellerHandles(locale: string): Promise<Set<string>> {
  if (!isShopifyConfigured(locale)) {
    return STATIC_BESTSELLER_HANDLES;
  }

  try {
    const handles = await getCachedOrFetch<string[]>(CACHE_KEY(locale), async () => {
      const client = getShopifyClient(locale);

      for (const handle of BESTSELLER_COLLECTION_HANDLES) {
        try {
          const data = await client.execute<{
            collection: { products: { nodes: Array<{ handle: string }> } } | null;
          }>(GET_COLLECTION_BY_HANDLE, { handle, first: 50 });

          const fromCollection = data?.collection?.products?.nodes?.map((p) => p.handle) ?? [];
          if (fromCollection.length > 0) {
            return [...new Set([...STATIC_BESTSELLER_HANDLES, ...fromCollection])];
          }
        } catch {
          // ponytail: try next collection handle
        }
      }

      return [...STATIC_BESTSELLER_HANDLES];
    }, 3600);

    return toHandleSet(handles);
  } catch {
    return STATIC_BESTSELLER_HANDLES;
  }
}
