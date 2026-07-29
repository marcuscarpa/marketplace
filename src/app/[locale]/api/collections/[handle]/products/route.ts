import { z } from 'zod';

import { SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import {
  buildFilterState,
  DEFAULT_FILTER_STATE,
} from '@/lib/product-filters';
import {
  COLLECTION_PAGE_SIZE,
  fetchCollectionFacets,
  fetchCollectionProductsPage,
} from '@/lib/shopify/collection-products';
import { getSaleProducts } from '@/lib/shopify/sale-products';

const querySchema = z.object({
  after: z.string().nullable().optional(),
  offset: z.coerce.number().int().min(0).optional(),
  first: z.coerce.number().int().min(1).max(50).optional(),
});

export async function GET(
  request: Request,
  context: { params: Promise<{ locale: string; handle: string }> }
) {
  const { locale, handle } = await context.params;
  const url = new URL(request.url);

  const parsed = querySchema.safeParse({
    after: url.searchParams.get('after'),
    offset: url.searchParams.get('offset') ?? undefined,
    first: url.searchParams.get('first') ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues.map((issue) => issue.message).join(', ') },
      { status: 400 }
    );
  }

  try {
    const isPaginated =
      (parsed.data.offset ?? 0) > 0 || Boolean(parsed.data.after);
    const filterParams = new URLSearchParams(url.searchParams);
    filterParams.delete('after');
    filterParams.delete('offset');
    filterParams.delete('first');
    filterParams.delete('locale');
    const hasFilterParams = [...filterParams.keys()].length > 0;

    const facets =
      isPaginated && !hasFilterParams
        ? null
        : await fetchCollectionFacets(handle, locale);

    const filters =
      facets === null
        ? DEFAULT_FILTER_STATE
        : buildFilterState(Object.fromEntries(filterParams.entries()), facets, []);

    let page = await fetchCollectionProductsPage(handle, locale, {
      first: parsed.data.first ?? COLLECTION_PAGE_SIZE,
      after: parsed.data.after ?? null,
      offset: parsed.data.offset ?? 0,
      filters,
      facets: facets ?? undefined,
    });

    if (
      handle === SHOPIFY_COLLECTION.sale &&
      page.products.length === 0 &&
      !parsed.data.after &&
      !parsed.data.offset
    ) {
      const saleProducts = await getSaleProducts(locale);
      const first = parsed.data.first ?? COLLECTION_PAGE_SIZE;
      page = {
        products: saleProducts.slice(0, first),
        collection: page.collection,
        pageInfo: {
          hasNextPage: saleProducts.length > first,
          endCursor: null,
          offset: Math.min(saleProducts.length, first),
        },
      };
    }

    return Response.json({
      products: page.products,
      pageInfo: page.pageInfo,
    });
  } catch {
    return Response.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
