import { describe, expect, it } from 'vitest';

import { buildHeaderCatalogNav } from '@/lib/catalog/header-nav';
import { shouldShowNavCollection } from '@/lib/catalog/nav-collection';

describe('nav-collection visibility', () => {
  it('hides collections confirmed empty in Shopify', () => {
    expect(shouldShowNavCollection({ handle: 'cut-outs', title: 'Cut-Outs', hasProducts: false })).toBe(
      false
    );
    expect(shouldShowNavCollection({ handle: 'bikini', title: 'Bikinis', hasProducts: true })).toBe(true);
    expect(shouldShowNavCollection({ handle: 'bikini', title: 'Bikinis' })).toBe(true);
  });

  it('omits empty submenu collections from header nav', () => {
    const byHandle = new Map([
      ['swimwear', { handle: 'swimwear', title: 'Swimwear', hasProducts: true }],
      ['bikini', { handle: 'bikini', title: 'Bikinis', hasProducts: true }],
      ['cut-outs', { handle: 'cut-outs', title: 'Cut-Outs', hasProducts: false }],
    ]);

    const nav = buildHeaderCatalogNav('en', byHandle);
    const swimwear = nav.find((item) => item.href === 'collections/swimwear');

    expect(swimwear?.children?.map((child) => child.href)).toEqual(['collections/bikini']);
  });
});
