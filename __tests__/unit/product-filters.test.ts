import { describe, expect, it } from 'vitest';

import { getCatalogCollection } from '@/lib/catalog/catalog';
import {
  DEFAULT_FILTER_STATE,
  classifySize,
  classifySizeForProduct,
  detectProductKind,
  extractFacets,
  filterAndSortProducts,
  catalogToFilterable,
  normalizeSizeValue,
  sanitizeFilters,
  type FilterableProduct,
} from '@/lib/product-filters';

function product(
  partial: Partial<FilterableProduct> & Pick<FilterableProduct, 'id' | 'handle' | 'title'>
): FilterableProduct {
  return {
    price: 100,
    available: true,
    colors: [],
    sizes: [],
    materials: [],
    sleeves: [],
    categoryHints: [],
    ...partial,
  };
}

describe('product-filters', () => {
  it('normalizes Shopify size labels', () => {
    expect(normalizeSizeValue('Size 8')).toBe('8');
    expect(normalizeSizeValue('Size 8.5')).toBe('8.5');
    expect(normalizeSizeValue('M')).toBe('M');
  });

  it('detects product kind from Shopify productType and tags', () => {
    expect(
      detectProductKind(
        product({
          id: '1',
          handle: 'loafer',
          title: 'Navy Penny Loafer',
          productType: 'Shoes',
          categoryHints: ['mens', 'shoes'],
        })
      )
    ).toBe('shoes');

    expect(
      detectProductKind(
        product({
          id: '2',
          handle: 'hat',
          title: 'Straw Hat',
          productType: 'Hats',
          categoryHints: ['hats'],
        })
      )
    ).toBe('accessories');

    expect(
      detectProductKind(
        product({
          id: '3',
          handle: 'bikini',
          title: 'Cora Bikini Top',
          productType: 'Bikini',
          categoryHints: ['bikini', 'swimwear'],
        })
      )
    ).toBe('clothing');
  });

  it('classifies apparel letter sizes as clothing, not accessories', () => {
    const swim = product({
      id: '1',
      handle: 'bikini',
      title: 'Bikini Top',
      productType: 'Bikini',
      categoryHints: ['bikini'],
    });

    expect(classifySizeForProduct('S', swim)).toBe('clothing');
    expect(classifySizeForProduct('M', swim)).toBe('clothing');
    expect(classifySizeForProduct('L', swim)).toBe('clothing');
    expect(classifySize('P')).toBe('clothing');
    expect(classifySize('G')).toBe('clothing');
    expect(classifySize('XL')).toBe('clothing');
    expect(classifySize('28')).toBe('clothing');
  });

  it('classifies shoe sizes on shoe products', () => {
    const shoes = product({
      id: '1',
      handle: 'loafer',
      title: 'Penny Loafer',
      productType: 'Shoes',
      categoryHints: ['mens', 'shoes'],
    });

    expect(classifySizeForProduct('8', shoes)).toBe('shoes');
    expect(classifySizeForProduct('8.5', shoes)).toBe('shoes');
    expect(classifySizeForProduct('10.5', shoes)).toBe('shoes');
    expect(classifySizeForProduct('14', shoes)).toBe('shoes');
    expect(classifySize('36')).toBe('shoes');
  });

  it('classifies hat sizes as accessories', () => {
    const hat = product({
      id: '1',
      handle: 'straw-hat',
      title: 'Straw Hat',
      productType: 'Hats',
      categoryHints: ['hats'],
    });

    expect(classifySizeForProduct('56-S', hat)).toBe('accessories');
    expect(classifySizeForProduct('57-M', hat)).toBe('accessories');
    expect(classifySize('ONE SIZE')).toBe('accessories');
  });

  it('groups and sorts sizes in facets for mixed collections', () => {
    const products: FilterableProduct[] = [
      product({
        id: '1',
        handle: 'shirt',
        title: 'Linen Shirt',
        productType: 'Linen shirt',
        categoryHints: ['mens', 'linen shirt'],
        colors: ['White'],
        sizes: ['S', 'M', 'L', 'XL'],
      }),
      product({
        id: '2',
        handle: 'loafers',
        title: 'Leather Loafers',
        productType: 'Shoes',
        categoryHints: ['mens', 'shoes'],
        colors: ['Black'],
        sizes: ['8', '8.5', '9', '9.5', '10', '10.5', '11'],
      }),
      product({
        id: '3',
        handle: 'tote',
        title: 'Straw Hat',
        productType: 'Hats',
        categoryHints: ['hats'],
        colors: ['Natural'],
        sizes: ['56-S', '57-M'],
      }),
    ];

    const facets = extractFacets(products);

    expect(facets.sizes.clothing).toEqual(['S', 'M', 'L', 'XL']);
    expect(facets.sizes.shoes).toEqual(['8', '8.5', '9', '9.5', '10', '10.5', '11']);
    expect(facets.sizes.accessories).toEqual(['56-S', '57-M']);
  });

  it('filters mens collection by category and size together', () => {
    const products: FilterableProduct[] = [
      product({
        id: '1',
        handle: 'pant',
        title: 'Amalfi Linen Pant',
        productType: 'Ready-to-Wear',
        categoryHints: ['mens', 'linen pants'],
        sizes: ['M', 'L'],
      }),
      product({
        id: '2',
        handle: 'loafer',
        title: 'Penny Loafer',
        productType: 'Shoes',
        categoryHints: ['mens', 'shoes'],
        sizes: ['10', '11'],
      }),
    ];

    const filtered = filterAndSortProducts(
      products,
      { ...DEFAULT_FILTER_STATE, category: 'mens', sizes: ['M'] },
      extractFacets(products).price
    );

    expect(filtered.map((p) => p.handle)).toEqual(['pant']);
  });

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
