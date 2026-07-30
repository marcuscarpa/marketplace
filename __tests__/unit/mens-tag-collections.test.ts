import { describe, expect, it } from 'vitest';

import {
  filterProductsForTagCollection,
  isTagFilteredCollectionHandle,
  tagFilteredCollectionTitle,
} from '@/lib/catalog/tag-filtered-collections';

describe('mens tag-filtered collections', () => {
  it('registers virtual mens subcategory handles', () => {
    expect(isTagFilteredCollectionHandle('mens-shirts')).toBe(true);
    expect(isTagFilteredCollectionHandle('mens-shorts')).toBe(true);
    expect(isTagFilteredCollectionHandle('mens-pants')).toBe(true);
    expect(isTagFilteredCollectionHandle('mens-shoes')).toBe(true);
    expect(isTagFilteredCollectionHandle('mens-collection')).toBe(false);
  });

  it('resolves localized titles', () => {
    expect(tagFilteredCollectionTitle('mens-shirts', 'en')).toBe('Shirts');
    expect(tagFilteredCollectionTitle('mens-shorts', 'pt')).toBe('Shorts');
    expect(tagFilteredCollectionTitle('mens-pants', 'pt')).toBe('Calças');
    expect(tagFilteredCollectionTitle('mens-shoes', 'pt')).toBe('Calçados');
  });

  it('groups mens products by tags and titles', () => {
    const products = [
      {
        id: '1',
        handle: 'white-amalfi-linen-shirt',
        title: 'White Amalfi Linen Shirt',
        tags: ['linen shirt', 'mens'],
      },
      {
        id: '2',
        handle: 'navy-breeze-swim-short',
        title: 'Navy Breeze Swim Short',
        tags: ['mens', 'spo-enabled'],
      },
      {
        id: '3',
        handle: 'navy-penny-loafer',
        title: 'Navy Penny Loafer',
        tags: ['mens', 'Shoes'],
      },
      {
        id: '4',
        handle: 'sand-dune-amalfi-slim-linen-pant',
        title: 'Sand Dune Amalfi Slim Linen Pants',
        tags: ['Linen pants', 'mens'],
      },
    ];

    expect(filterProductsForTagCollection(products, 'mens-shirts').map((p) => p.handle)).toEqual([
      'white-amalfi-linen-shirt',
    ]);
    expect(filterProductsForTagCollection(products, 'mens-shorts').map((p) => p.handle)).toEqual([
      'navy-breeze-swim-short',
    ]);
    expect(filterProductsForTagCollection(products, 'mens-pants').map((p) => p.handle)).toEqual([
      'sand-dune-amalfi-slim-linen-pant',
    ]);
    expect(filterProductsForTagCollection(products, 'mens-shoes').map((p) => p.handle)).toEqual([
      'navy-penny-loafer',
    ]);
  });
});
