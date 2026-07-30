'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FilterDrawer, FilterTrigger } from '@/components/storefront/filter-drawer';
import { CollectionGridVideo } from '@/components/storefront/collection-grid-video';
import { PopularCard } from '@/components/storefront/product-card';
import { PRODUCT_GAP } from '@/components/storefront/ui';
import { ProductCard } from '@/components/ui/product-card';
import type { CatalogProduct } from '@/lib/catalog/data';
import {
  COLLECTION_GRID_VIDEO_SLOT_COUNT,
  getCollectionGridVideo,
} from '@/lib/catalog/collection-grid-video';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { m } from '@/lib/i18n';
import { resolveCatalogProductTags, resolveShopifyProductTags } from '@/lib/product-tags';
import {
  activeFilterCount,
  DEFAULT_FILTER_STATE,
  extractFacets,
  filterAndSortProducts,
  catalogToFilterable,
  filterStateToParams,
  sanitizeFilters,
  shopifyToFilterable,
  type FilterState,
  type ProductFacets,
} from '@/lib/product-filters';
import type { ShopifyProduct } from '@/lib/shopify/types';

type ShopifyCollectionProduct = ShopifyProduct & {
  tags?: string[];
  publishedAt?: string | null;
  totalInventory?: number | null;
};

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
  offset: number;
}

interface ShopifyCollectionProductsProps {
  collectionHandle: string;
  products: ShopifyCollectionProduct[];
  pageInfo: PageInfo;
  facets: ProductFacets;
  locale: string;
  collectionTitle: string;
  bestsellerHandles?: Set<string>;
  forceSaleBadge?: boolean;
  initialFilters?: FilterState;
}

interface CollectionProductsProps {
  products: CatalogProduct[];
  locale: string;
  collectionTitle: string;
}

const CATALOG_PAGE_SIZE = 20;

function CollectionGridShell({
  count,
  activeCount,
  onOpenFilters,
  locale,
  children,
  toolbarClassName = 'mb-8',
  footer,
}: {
  count: number;
  activeCount: number;
  onOpenFilters: () => void;
  locale: string;
  children: React.ReactNode;
  toolbarClassName?: string;
  footer?: React.ReactNode;
}) {
  const col = m(locale).collection;
  return (
    <>
      <div className={`flex items-center justify-between ${toolbarClassName}`}>
        <p className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-[#03060799]">
          {col.productCount(count)}
        </p>
        <FilterTrigger onClick={onOpenFilters} count={activeCount} locale={locale} />
      </div>
      {children}
      {footer}
    </>
  );
}

function useProductGrid<T extends { handle: string; id?: string }>(
  products: T[],
  filterable: ReturnType<typeof shopifyToFilterable>[],
  filters: FilterState,
  facets: ProductFacets
) {
  const clean = useMemo(
    () => sanitizeFilters(filters, facets, filterable),
    [filters, facets, filterable]
  );
  const activeCount = activeFilterCount(clean, facets.price);

  const visibleProducts = useMemo(() => {
    const byHandle = new Map(products.map((p) => [p.handle, p]));
    return filterAndSortProducts(filterable, clean, facets.price)
      .map((p) => byHandle.get(p.handle))
      .filter((p): p is T => p !== null && p !== undefined);
  }, [filterable, clean, facets.price, products]);

  return { clean, activeCount, visibleProducts };
}

function CatalogInfiniteGrid({
  products,
  locale,
}: {
  products: CatalogProduct[];
  locale: string;
}) {
  const [visibleCount, setVisibleCount] = useState(CATALOG_PAGE_SIZE);
  const visible = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const loadMore = useCallback(() => {
    setVisibleCount((count) => Math.min(count + CATALOG_PAGE_SIZE, products.length));
  }, [products.length]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  return (
    <>
      <div className={`grid grid-cols-2 ${PRODUCT_GAP} lg:grid-cols-4`}>
        {visible.map((product) => (
          <PopularCard
            key={product.handle}
            product={product}
            badges={resolveCatalogProductTags(product)}
            locale={locale}
          />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="py-10 text-center font-sans-ui text-[11px] uppercase tracking-[0.08em] text-[#03060766]">
          {m(locale).common.loading}
        </div>
      )}
    </>
  );
}

export function ShopifyCollectionProducts({
  collectionHandle,
  products: initialProducts,
  pageInfo: initialPageInfo,
  facets,
  locale,
  collectionTitle,
  bestsellerHandles,
  forceSaleBadge = false,
  initialFilters,
}: ShopifyCollectionProductsProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters ?? DEFAULT_FILTER_STATE);
  const [products, setProducts] = useState(initialProducts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const isFirstFilterEffect = useRef(true);
  const col = m(locale).collection;

  const filterable = useMemo(() => products.map(shopifyToFilterable), [products]);
  const { clean, activeCount, visibleProducts } = useProductGrid(
    products,
    filterable,
    filters,
    facets
  );
  const gridProducts = activeCount === 0 ? products : visibleProducts;
  const gridVideo = activeCount === 0 ? getCollectionGridVideo(collectionHandle) : null;
  const gridVideoProductOffset = gridVideo ? COLLECTION_GRID_VIDEO_SLOT_COUNT : 0;
  const productsForGrid =
    gridVideoProductOffset > 0
      ? gridProducts.slice(gridVideoProductOffset)
      : gridProducts;
  const filterKey = useMemo(() => filterStateToParams(filters).toString(), [filters]);
  const filtersRef = useRef(filters);
  const facetsRef = useRef(facets);
  filtersRef.current = filters;
  facetsRef.current = facets;

  const fetchPageRef = useRef<
    (mode: 'replace' | 'append', next?: Partial<PageInfo>) => Promise<void>
  >(async () => {});
  const pageInfoRef = useRef(pageInfo);
  pageInfoRef.current = pageInfo;

  const fetchPage = useCallback(
    async (mode: 'replace' | 'append', next?: Partial<PageInfo>) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);

      try {
        const currentFilters = filtersRef.current;
        const currentFacets = facetsRef.current;
        const currentFilterable = filterable;
        const params = filterStateToParams(
          sanitizeFilters(currentFilters, currentFacets, currentFilterable)
        );
        params.set('locale', locale);
        params.set('first', String(CATALOG_PAGE_SIZE));
        if (mode === 'append') {
          const offsetSource = next ?? pageInfoRef.current;
          if (offsetSource.offset != null && offsetSource.offset > 0) {
            params.set('offset', String(offsetSource.offset));
          }
        }

        const res = await fetch(
          `/${locale}/api/collections/${collectionHandle}/products?${params.toString()}`
        );
        if (!res.ok) {
          setPageInfo((current) => ({ ...current, hasNextPage: false }));
          return;
        }

        const data = (await res.json()) as {
          products: ShopifyCollectionProduct[];
          pageInfo: PageInfo;
        };

        if (mode === 'replace') {
          setProducts(data.products);
          setPageInfo(data.pageInfo);
          return;
        }

        let added = 0;
        setProducts((current) => {
          const seen = new Set(current.map((product) => product.id));
          const merged = [...current];
          for (const product of data.products) {
            if (seen.has(product.id)) continue;
            seen.add(product.id);
            merged.push(product);
            added++;
          }
          return merged;
        });

        const stopPagination = added === 0 || data.products.length === 0;
        setPageInfo(
          stopPagination ? { ...data.pageInfo, hasNextPage: false } : data.pageInfo
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [collectionHandle, filterable, locale]
  );
  fetchPageRef.current = fetchPage;

  useEffect(() => {
    if (isFirstFilterEffect.current) {
      isFirstFilterEffect.current = false;
      if (activeFilterCount(filters, facets.price) === 0) return;
    }
    void fetchPageRef.current('replace');
  }, [filterKey]);

  const loadMore = useCallback(() => {
    if (!pageInfoRef.current.hasNextPage || loadingRef.current) return;
    void fetchPageRef.current('append', pageInfoRef.current);
  }, []);

  const sentinelRef = useInfiniteScroll(loadMore, pageInfo.hasNextPage && !loading);

  return (
    <>
      <CollectionGridShell
        count={gridProducts.length}
        activeCount={activeCount}
        onOpenFilters={() => setDrawerOpen(true)}
        locale={locale}
        footer={
          pageInfo.hasNextPage ? (
            <div
              ref={sentinelRef}
              className="py-10 text-center font-sans-ui text-[11px] uppercase tracking-[0.08em] text-[#03060766]"
            >
              {loading ? m(locale).common.loading : '\u00a0'}
            </div>
          ) : null
        }
      >
        {gridProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gridVideo && (
              <CollectionGridVideo
                src={gridVideo.src}
                alt={gridVideo.alt}
                locale={locale}
                productHandle={gridVideo.productHandle}
                posterImage={gridVideo.posterImage}
              />
            )}
            {productsForGrid.map((product) => {
              const badges = resolveShopifyProductTags(product, { bestsellerHandles });
              if (forceSaleBadge && !badges.includes('sale')) {
                badges.unshift('sale');
              }
              return (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    badges,
                  }}
                  locale={locale}
                />
              );
            })}
          </div>
        ) : (
          <p className="py-20 text-center font-sans-ui text-[12px] uppercase tracking-[0.02em] text-[#03060799]">
            {col.noMatch}{' '}
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTER_STATE)}
              className="underline underline-offset-2"
            >
              {col.clearFilters}
            </button>
          </p>
        )}
      </CollectionGridShell>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={clean}
        onChange={setFilters}
        facets={facets}
        filterable={filterable}
        collectionTitle={collectionTitle}
        locale={locale}
      />
    </>
  );
}

export function CollectionProducts({
  products,
  locale,
  collectionTitle,
}: CollectionProductsProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const filterable = useMemo(() => products.map(catalogToFilterable), [products]);
  const facets = useMemo(() => extractFacets(filterable), [filterable]);
  const { clean, activeCount, visibleProducts } = useProductGrid(
    products,
    filterable,
    filters,
    facets
  );
  const col = m(locale).collection;

  return (
    <>
      <CollectionGridShell
        count={visibleProducts.length}
        activeCount={activeCount}
        onOpenFilters={() => setDrawerOpen(true)}
        locale={locale}
        toolbarClassName="mb-10"
      >
        {visibleProducts.length > 0 ? (
          <CatalogInfiniteGrid products={visibleProducts} locale={locale} />
        ) : (
          <p className="py-20 text-center font-sans-ui text-[12px] uppercase tracking-[0.02em] text-[#03060799]">
            {col.noMatch}{' '}
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTER_STATE)}
              className="underline underline-offset-2"
            >
              {col.clearFilters}
            </button>
          </p>
        )}
      </CollectionGridShell>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={clean}
        onChange={setFilters}
        facets={facets}
        filterable={filterable}
        collectionTitle={collectionTitle}
        locale={locale}
      />
    </>
  );
}
