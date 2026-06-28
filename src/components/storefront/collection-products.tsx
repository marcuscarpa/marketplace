'use client';

import { useMemo, useState } from 'react';

import { FilterDrawer, FilterTrigger } from '@/components/storefront/filter-drawer';
import { PopularCard } from '@/components/storefront/product-card';
import { PRODUCT_GAP } from '@/components/storefront/ui';
import { ProductCard } from '@/components/ui/product-card';
import type { CatalogProduct } from '@/lib/catalog/data';
import { m } from '@/lib/i18n';
import { resolveCatalogProductTags, resolveShopifyProductTags } from '@/lib/product-tags';
import {
  activeFilterCount,
  DEFAULT_FILTER_STATE,
  extractFacets,
  filterAndSortProducts,
  catalogToFilterable,
  sanitizeFilters,
  shopifyToFilterable,
  type FilterState,
} from '@/lib/product-filters';
import type { ShopifyProduct } from '@/lib/shopify/types';

type ShopifyCollectionProduct = ShopifyProduct & {
  tags?: string[];
  publishedAt?: string | null;
  totalInventory?: number | null;
};

interface ShopifyCollectionProductsProps {
  products: ShopifyCollectionProduct[];
  locale: string;
  collectionTitle: string;
  bestsellerHandles?: Set<string>;
}

interface CollectionProductsProps {
  products: CatalogProduct[];
  locale: string;
  collectionTitle: string;
}

function CollectionGridShell({
  count,
  activeCount,
  onOpenFilters,
  locale,
  children,
  toolbarClassName = 'mb-8',
}: {
  count: number;
  activeCount: number;
  onOpenFilters: () => void;
  locale: string;
  children: React.ReactNode;
  toolbarClassName?: string;
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
    </>
  );
}

function useProductGrid<T extends { handle: string }>(
  products: T[],
  filterable: ReturnType<typeof shopifyToFilterable>[],
  filters: FilterState
) {
  const facets = useMemo(() => extractFacets(filterable), [filterable]);
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

  return { facets, clean, activeCount, visibleProducts };
}

export function ShopifyCollectionProducts({
  products,
  locale,
  collectionTitle,
  bestsellerHandles,
}: ShopifyCollectionProductsProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const filterable = useMemo(() => products.map(shopifyToFilterable), [products]);
  const { facets, clean, activeCount, visibleProducts } = useProductGrid(
    products,
    filterable,
    filters
  );
  const col = m(locale).collection;

  return (
    <>
      <CollectionGridShell
        count={visibleProducts.length}
        activeCount={activeCount}
        onOpenFilters={() => setDrawerOpen(true)}
        locale={locale}
      >
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  badges: resolveShopifyProductTags(product, { bestsellerHandles }),
                }}
                locale={locale}
              />
            ))}
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
  const { facets, clean, activeCount, visibleProducts } = useProductGrid(
    products,
    filterable,
    filters
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
          <div className={`grid grid-cols-2 ${PRODUCT_GAP} lg:grid-cols-4`}>
            {visibleProducts.map((product) => (
              <PopularCard
                key={product.handle}
                product={product}
                badges={resolveCatalogProductTags(product)}
                locale={locale}
              />
            ))}
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
