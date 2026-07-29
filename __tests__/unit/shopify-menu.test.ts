import { describe, expect, it } from 'vitest';

import {
  buildCombinedSourcesFromMenu,
  combinedParentHrefForMenuItem,
  isCombinedCollectionHandle,
  sourceHandlesForCollection,
} from '@/lib/catalog/combined-collections';
import {
  buildCatalogNavFromFooterMenu,
  collectionHandleFromMenuUrl,
  isAccessoriesGroupUrl,
} from '@/lib/shopify/menu';

describe('shopify menu', () => {
  it('parses collection handles from Shopify menu URLs', () => {
    expect(collectionHandleFromMenuUrl('https://sinesiakarol.com/collections/bags')).toBe('bags');
    expect(collectionHandleFromMenuUrl('https://sinesiakarol.com/collections/hats/Hats+shoes+bags')).toBe(
      'hats'
    );
  });

  it('detects combined accessories parent URLs', () => {
    expect(isAccessoriesGroupUrl('https://sinesiakarol.com/collections/hats/Hats+shoes+bags')).toBe(true);
    expect(isAccessoriesGroupUrl('https://sinesiakarol.com/collections/bags')).toBe(false);
  });

  it('builds header nav from footer menu and skips missing collections', () => {
    const byHandle = new Map([
      ['jardim-oriental', { handle: 'jardim-oriental', title: 'Jardim Oriental' }],
      ['enseada', { handle: 'enseada', title: 'Enseada' }],
      ['bags', { handle: 'bags', title: 'Bags' }],
      ['shoes', { handle: 'shoes', title: 'Shoes' }],
      ['hats', { handle: 'hats', title: 'Hats' }],
    ]);

    const nav = buildCatalogNavFromFooterMenu(
      'en',
      {
        id: '1',
        title: 'Categories',
        items: [
          {
            title: '- New Collections',
            url: 'https://sinesiakarol.com/collections/jardim-oriental',
            type: 'COLLECTION',
            items: [
              {
                title: 'Enseada',
                url: 'https://sinesiakarol.com/collections/enseada',
                type: 'COLLECTION',
              },
              {
                title: 'Missing',
                url: 'https://sinesiakarol.com/collections/garden-collection',
                type: 'COLLECTION',
              },
            ],
          },
          {
            title: '- Acessories',
            url: 'https://sinesiakarol.com/collections/hats/Hats+shoes+bags',
            type: 'COLLECTION',
            items: [
              { title: 'Bags', url: 'https://sinesiakarol.com/collections/bags', type: 'COLLECTION' },
              { title: 'Shoes', url: 'https://sinesiakarol.com/collections/shoes', type: 'COLLECTION' },
              { title: 'Hats', url: 'https://sinesiakarol.com/collections/hats', type: 'COLLECTION' },
            ],
          },
        ],
      },
      byHandle
    );

    expect(nav[0]?.href).toBe('collections/jardim-oriental');
    expect(nav[0]?.children?.map((c) => c.href)).toEqual(['collections/enseada']);
    expect(nav[1]?.href).toBe('collections/accessories');
    expect(nav[1]?.children?.map((c) => c.label)).toEqual(['Bags', 'Shoes', 'Hats']);
  });

  it('routes parent menu items with children to combined PLPs', () => {
    expect(
      combinedParentHrefForMenuItem('https://sinesiakarol.com/collections/swimwear', ['bikini'])
    ).toBe('swimwear');
    expect(
      combinedParentHrefForMenuItem('https://sinesiakarol.com/collections/hats/Hats+shoes+bags', [
        'bags',
        'shoes',
        'hats',
      ])
    ).toBe('accessories');
    expect(combinedParentHrefForMenuItem('https://sinesiakarol.com/collections/hats', [])).toBeNull();
  });

  it('builds combined sources from footer menu', () => {
    const combined = buildCombinedSourcesFromMenu({
      id: '1',
      title: 'Footer',
      items: [
        {
          title: 'Swimwear',
          url: 'https://sinesiakarol.com/collections/swimwear',
          type: 'COLLECTION',
          items: [
            { title: 'Bikini', url: 'https://sinesiakarol.com/collections/bikini', type: 'COLLECTION' },
            { title: 'One Piece', url: 'https://sinesiakarol.com/collections/one-piece', type: 'COLLECTION' },
          ],
        },
        {
          title: 'Accessories',
          url: 'https://sinesiakarol.com/collections/hats/Hats+shoes+bags',
          type: 'COLLECTION',
          items: [
            { title: 'Hats', url: 'https://sinesiakarol.com/collections/hats', type: 'COLLECTION' },
          ],
        },
      ],
    });

    expect(combined.swimwear).toEqual(['bikini', 'one-piece']);
    expect(combined.accessories).toEqual(['hats']);
  });

  it('merges parent collections and keeps submenu collections separate', () => {
    expect(sourceHandlesForCollection('accessories')).toEqual(['bags', 'shoes', 'hats']);
    expect(sourceHandlesForCollection('swimwear')).toEqual([
      'bikini',
      'bikini-bottom',
      'bikini-top',
      'cover-up',
      'one-piece',
    ]);
    expect(sourceHandlesForCollection('hats')).toEqual(['hats']);
    expect(sourceHandlesForCollection('bikini')).toEqual(['bikini']);
    expect(isCombinedCollectionHandle('all-rtw')).toBe(true);
    expect(isCombinedCollectionHandle('dresses')).toBe(false);
  });
});
