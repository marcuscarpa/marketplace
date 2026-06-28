import { describe, expect, it } from 'vitest';

import { getCatalogCollection } from '@/lib/catalog/catalog';
import {
  DEFAULT_FILTER_STATE,
  extractFacets,
  filterAndSortProducts,
  catalogToFilterable,
  sanitizeFilters,
} from '@/lib/product-filters';

describe('product-filters', () => {
  it('shows all catalog collection products with default filters', () => {
    const collection = getCatalogCollection('all');
    expect(collection).not.toBeNull();

    const products = collection!.products.map(catalogToFilterable);
    const facets = extractFacets(products);
    const visible = filterAndSortProducts(products, DEFAULT_FILTER_STATE, facets.price);

    expect(visible.length).toBe(collection!.products.length);
  });

  it('sorts by price ascending when price range is active', () => {
    const collection = getCatalogCollection('all');
    const products = collection!.products.map(catalogToFilterable);
    const facets = extractFacets(products);
    const bounds = facets.price;

    const filtered = filterAndSortProducts(
      products,
      { ...DEFAULT_FILTER_STATE, priceMax: Math.floor((bounds.min + bounds.max) / 2) },
      bounds
    );

    for (let i = 1; i < filtered.length; i++) {
      expect(filtered[i]!.price).toBeGreaterThanOrEqual(filtered[i - 1]!.price);
    }
  });

  it('drops color filters that do not exist in the collection', () => {
    const collection = getCatalogCollection('all');
    const products = collection!.products.map(catalogToFilterable);
    const facets = extractFacets(products);

    const clean = sanitizeFilters(
      { ...DEFAULT_FILTER_STATE, colors: ['White'] },
      facets,
      products
    );

    expect(clean.colors).toEqual([]);
  });
});
