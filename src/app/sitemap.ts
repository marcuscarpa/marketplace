import { unstable_cache } from 'next/cache';
import type { MetadataRoute } from 'next';

import { SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import { isShopifyConfigured, getShopifyClient } from '@/lib/shopify/client';
import { GET_ALL_PRODUCTS, GET_COLLECTIONS } from '@/lib/shopify/queries';
import { getAppUrl } from '@/lib/site-metadata';

const LOCALES = ['en', 'pt'] as const;

const STATIC_PAGES = [
  { path: '', priority: 1, frequency: 'weekly' as const },
  { path: 'about', priority: 0.6, frequency: 'monthly' as const },
  { path: 'our-brand', priority: 0.6, frequency: 'monthly' as const },
  { path: 'meet-the-designer', priority: 0.6, frequency: 'monthly' as const },
  { path: 'contact', priority: 0.6, frequency: 'monthly' as const },
  { path: 'locations', priority: 0.5, frequency: 'monthly' as const },
  { path: 'shipping', priority: 0.4, frequency: 'yearly' as const },
  { path: 'returns', priority: 0.4, frequency: 'yearly' as const },
  { path: 'size-chart', priority: 0.4, frequency: 'yearly' as const },
  { path: 'terms-of-use', priority: 0.2, frequency: 'yearly' as const },
  { path: 'terms', priority: 0.2, frequency: 'yearly' as const },
  { path: 'privacy', priority: 0.2, frequency: 'yearly' as const },
  { path: 'cookies', priority: 0.2, frequency: 'yearly' as const },
  { path: 'mobile-terms', priority: 0.2, frequency: 'yearly' as const },
] as const;

const FALLBACK_COLLECTION_HANDLES = [
  SHOPIFY_COLLECTION.shopAll,
  SHOPIFY_COLLECTION.newArrivals,
  SHOPIFY_COLLECTION.swimwear,
  SHOPIFY_COLLECTION.readyToWear,
  SHOPIFY_COLLECTION.featured,
  SHOPIFY_COLLECTION.accessories,
  SHOPIFY_COLLECTION.sale,
  SHOPIFY_COLLECTION.bestsellers,
  SHOPIFY_COLLECTION.men,
  'bikini',
  'bikini-bottom',
  'bikini-top',
  'cover-up',
  'one-piece',
  'cut-outs',
  'dresses',
  'tops',
  'pants-shorts',
  'skirts',
  'bags',
  'shoes',
  'hats',
  'pearl-collection',
  'pearl-tropical',
  'ocean-leque',
  'trancoso',
  'orquidea',
  'florias',
  'orchid-collection',
  'green-tea',
  'enseada',
] as const;

const PAGE_SIZE = 100;
const MAX_PRODUCTS = 2000;

interface SitemapCollection {
  handle: string;
}

interface SitemapProduct {
  handle: string;
}

type CollectionsResponse = {
  collections: { nodes: Array<{ handle: string }> };
};

type ProductsResponse = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: Array<{ handle: string }>;
  };
};

const getShopifyUrls = unstable_cache(
  async (): Promise<{ collections: SitemapCollection[]; products: SitemapProduct[] } | null> => {
    if (!isShopifyConfigured('en')) return null;

    const client = getShopifyClient('en');
    const collections: SitemapCollection[] = [];
    const products: SitemapProduct[] = [];

    try {
      const collectionData = await client.execute<CollectionsResponse>(GET_COLLECTIONS, {
        first: 250,
      });
      for (const node of collectionData.collections?.nodes ?? []) {
        if (node?.handle) collections.push({ handle: node.handle });
      }
    } catch {
      // ponytail: sitemap still works with fallback handles below
    }

    try {
      let after: string | null = null;
      let fetched = 0;
      do {
        const data: ProductsResponse = await client.execute<ProductsResponse>(GET_ALL_PRODUCTS, {
          first: PAGE_SIZE,
          after,
        });
        for (const node of data.products?.nodes ?? []) {
          if (node?.handle) products.push({ handle: node.handle });
        }
        fetched += data.products?.nodes?.length ?? 0;
        after = data.products?.pageInfo?.hasNextPage
          ? (data.products.pageInfo.endCursor ?? null)
          : null;
      } while (after && fetched < MAX_PRODUCTS);
    } catch {
      // ponytail: if product fetch fails, still emit collection + static urls
    }

    return { collections, products };
  },
  ['sitemap-shopify-urls'],
  { revalidate: 3600 }
);

function uniqueHandles(handles: readonly string[]): string[] {
  return [...new Set(handles)];
}

function buildCollectionUrls(base: string, handles: readonly string[], now: Date): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    uniqueHandles(handles).map((handle) => ({
      url: `${base}/${locale}/collections/${handle}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );
}

function buildProductUrls(base: string, handles: readonly string[], now: Date): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    uniqueHandles(handles).map((handle) => ({
      url: `${base}/${locale}/products/${handle}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getAppUrl();
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_PAGES.map((page) => ({
      url: `${base}/${locale}${page.path ? `/${page.path}` : ''}`,
      lastModified: now,
      changeFrequency: page.frequency,
      priority: page.priority,
    }))
  );

  const shopify = await getShopifyUrls();
  const shopifyHandles = new Set((shopify?.collections ?? []).map((c) => c.handle));
  const collectionHandles = [...FALLBACK_COLLECTION_HANDLES, ...shopifyHandles];
  const productHandles = (shopify?.products ?? []).map((p) => p.handle);

  const collectionUrls = buildCollectionUrls(base, collectionHandles, now);
  const productUrls = buildProductUrls(base, productHandles, now);

  return [...staticUrls, ...collectionUrls, ...productUrls];
}
