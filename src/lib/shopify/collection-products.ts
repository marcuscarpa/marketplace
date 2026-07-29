import { resolveSourceHandles } from '@/lib/catalog/combined-collections';
import {
  activeFilterCount,
  applyFilters,
  extractFacets,
  shopifyToFilterable,
  type FilterState,
  type ProductFacets,
} from '@/lib/product-filters';
import { getShopifyClient } from '@/lib/shopify/client';
import { GET_COLLECTION_BY_HANDLE } from '@/lib/shopify/queries';
import type { ShopifyProduct } from '@/lib/shopify/types';

export const COLLECTION_PAGE_SIZE = 20;
const FACET_SCAN_PAGE_SIZE = 50;
const FACET_SCAN_MAX_PRODUCTS = 250;
const FILTER_FETCH_BATCH = 40;

type CollectionProductQuery = {
  collection: {
    id: string;
    title: string;
    description: string;
    handle: string;
    image: { url: string; altText: string | null } | null;
    products: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: ShopifyProduct[];
    };
  } | null;
};

export interface CollectionProductsPage {
  products: ShopifyProduct[];
  collection: CollectionProductQuery['collection'];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
    offset: number;
  };
}

async function fetchShopifyCollectionPage(
  handle: string,
  locale: string,
  first: number,
  after?: string | null
): Promise<CollectionProductsPage> {
  const client = getShopifyClient(locale);
  const data = await client.execute<CollectionProductQuery>(GET_COLLECTION_BY_HANDLE, {
    handle,
    first,
    after: after ?? null,
  });

  return {
    products: data.collection?.products.nodes ?? [],
    collection: data.collection,
    pageInfo: {
      hasNextPage: data.collection?.products.pageInfo.hasNextPage ?? false,
      endCursor: data.collection?.products.pageInfo.endCursor ?? null,
      offset: 0,
    },
  };
}

async function fetchProductsFromCollection(
  handle: string,
  locale: string,
  maxProducts = FACET_SCAN_MAX_PRODUCTS
): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = [];
  const seen = new Set<string>();
  let after: string | null = null;
  let hasNext = true;

  while (hasNext && products.length < maxProducts) {
    const page = await fetchShopifyCollectionPage(
      handle,
      locale,
      FACET_SCAN_PAGE_SIZE,
      after
    );
    for (const product of page.products) {
      if (seen.has(product.id)) continue;
      seen.add(product.id);
      products.push(product);
      if (products.length >= maxProducts) break;
    }
    hasNext = page.pageInfo.hasNextPage;
    after = page.pageInfo.endCursor;
  }

  return products;
}

/** Round-robin merge so combined PLPs mix bags, shoes, and hats on every page. */
function interleaveProductLists(lists: ShopifyProduct[][]): ShopifyProduct[] {
  const seen = new Set<string>();
  const merged: ShopifyProduct[] = [];
  const maxLen = Math.max(0, ...lists.map((list) => list.length));

  for (let index = 0; index < maxLen; index++) {
    for (const list of lists) {
      const product = list[index];
      if (!product || seen.has(product.id)) continue;
      seen.add(product.id);
      merged.push(product);
    }
  }

  return merged;
}

async function fetchAllProductsForFacets(
  handle: string,
  locale: string
): Promise<ShopifyProduct[]> {
  const sourceHandles = await resolveSourceHandles(handle, locale);

  if (sourceHandles.length === 1) {
    return fetchProductsFromCollection(sourceHandles[0]!, locale);
  }

  const lists = await Promise.all(
    sourceHandles.map((sourceHandle) => fetchProductsFromCollection(sourceHandle, locale))
  );
  return interleaveProductLists(lists);
}

export async function fetchCollectionFacets(
  handle: string,
  locale: string
): Promise<ProductFacets> {
  const products = await fetchAllProductsForFacets(handle, locale);
  return extractFacets(products.map(shopifyToFilterable));
}

function hasActiveFilters(filters: FilterState, facets: ProductFacets): boolean {
  return activeFilterCount(filters, facets.price) > 0;
}

async function fetchFilteredSingleCollectionPage(
  handle: string,
  locale: string,
  filters: FilterState,
  facets: ProductFacets,
  first: number,
  after: string | null
): Promise<CollectionProductsPage> {
  let cursor = after;
  let hasNext = true;
  const matched: ShopifyProduct[] = [];
  const seen = new Set<string>();
  let lastCollection: CollectionProductQuery['collection'] = null;

  while (matched.length < first && hasNext) {
    const batch = await fetchShopifyCollectionPage(handle, locale, FILTER_FETCH_BATCH, cursor);
    lastCollection = batch.collection;
    hasNext = batch.pageInfo.hasNextPage;
    cursor = batch.pageInfo.endCursor;

    if (batch.products.length === 0) break;

    const filterable = batch.products.map(shopifyToFilterable);
    const allowed = new Set(applyFilters(filterable, filters).map((p) => p.id));

    for (const product of batch.products) {
      if (!allowed.has(product.id) || seen.has(product.id)) continue;
      seen.add(product.id);
      matched.push(product);
      if (matched.length >= first) break;
    }
  }

  return {
    products: matched,
    collection: lastCollection,
    pageInfo: {
      hasNextPage: hasNext,
      endCursor: cursor,
      offset: 0,
    },
  };
}

async function fetchCombinedCollectionPage(
  handle: string,
  locale: string,
  first: number,
  offset: number
): Promise<CollectionProductsPage> {
  const all = await fetchAllProductsForFacets(handle, locale);
  const slice = all.slice(offset, offset + first);
  const nextOffset = offset + slice.length;

  return {
    products: slice,
    collection: null,
    pageInfo: {
      hasNextPage: nextOffset < all.length,
      endCursor: null,
      offset: nextOffset,
    },
  };
}

async function fetchFilteredCombinedCollectionPage(
  handle: string,
  locale: string,
  filters: FilterState,
  first: number,
  offset: number
): Promise<CollectionProductsPage> {
  const all = await fetchAllProductsForFacets(handle, locale);
  const filterable = all.map(shopifyToFilterable);
  const filtered = applyFilters(filterable, filters);
  const byId = new Map(all.map((p) => [p.id, p]));
  const ordered = filtered
    .map((p) => byId.get(p.id))
    .filter((p): p is ShopifyProduct => p !== undefined);
  const slice = ordered.slice(offset, offset + first);
  const nextOffset = offset + slice.length;

  return {
    products: slice,
    collection: null,
    pageInfo: {
      hasNextPage: nextOffset < ordered.length,
      endCursor: null,
      offset: nextOffset,
    },
  };
}

export async function fetchCollectionProductsPage(
  handle: string,
  locale: string,
  options: {
    first?: number;
    after?: string | null;
    offset?: number;
    filters?: FilterState;
    facets?: ProductFacets;
  } = {}
): Promise<CollectionProductsPage> {
  const first = options.first ?? COLLECTION_PAGE_SIZE;
  const after = options.after ?? null;
  const offset = options.offset ?? 0;
  const filters = options.filters;
  const facets = options.facets;
  const sourceHandles = await resolveSourceHandles(handle, locale);
  const isCombined = sourceHandles.length > 1;
  const filtering = filters && facets && hasActiveFilters(filters, facets);

  if (isCombined) {
    return filtering
      ? fetchFilteredCombinedCollectionPage(handle, locale, filters, first, offset)
      : fetchCombinedCollectionPage(handle, locale, first, offset);
  }

  const sourceHandle = sourceHandles[0]!;
  if (filtering) {
    return fetchFilteredSingleCollectionPage(sourceHandle, locale, filters, facets, first, after);
  }

  return fetchShopifyCollectionPage(sourceHandle, locale, first, after);
}

/** Initial SSR payload: first page + facet metadata for filters. */
export async function fetchCollectionInitialPayload(handle: string, locale: string) {
  const [page, facets] = await Promise.all([
    fetchCollectionProductsPage(handle, locale, { first: COLLECTION_PAGE_SIZE }),
    fetchCollectionFacets(handle, locale),
  ]);

  return { page, facets };
}

/** @deprecated Use fetchCollectionProductsPage for paginated loads. */
export async function fetchCollectionProducts(handle: string, locale: string) {
  const page = await fetchCollectionProductsPage(handle, locale, {
    first: COLLECTION_PAGE_SIZE,
  });
  return {
    products: page.products,
    collection: page.collection,
  };
}

export { COLLECTION_PAGE_SIZE as COLLECTION_PRODUCT_LIMIT };
