import { describe, expect, it } from 'vitest';

import { searchCatalogProducts } from '@/lib/catalog/catalog';

describe('searchCatalogProducts', () => {
  it('filters luna by title instead of returning the full curated modal set', () => {
    const luna = searchCatalogProducts('luna', 50);

    expect(luna.length).toBeGreaterThan(0);
    expect(luna.length).toBeLessThan(6);
    expect(
      luna.every((p) => p.title.toLowerCase().includes('luna') || p.handle.toLowerCase().includes('luna'))
    ).toBe(true);
  });

  it('does not dump curated products on partial prefix lu', () => {
    const partial = searchCatalogProducts('lu', 50);
    expect(partial.length).toBeLessThan(6);
  });
});
