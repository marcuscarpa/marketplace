import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/cache/stampede', () => ({
  getCachedOrFetch: vi.fn(async (_key: string, fetchFn: () => Promise<unknown>) => {
    return fetchFn();
  }),
}));

const mockSearchResults = [
  {
    id: 'gid://shopify/Product/1',
    title: 'Silk Evening Gown',
    handle: 'silk-evening-gown',
    images: { nodes: [{ url: 'https://example.com/gown.jpg', altText: 'Gown' }] },
    priceRange: { minVariantPrice: { amount: '1200.00', currencyCode: 'USD' } },
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Cashmere Coat',
    handle: 'cashmere-coat',
    images: { nodes: [{ url: 'https://example.com/coat.jpg', altText: 'Coat' }] },
    priceRange: { minVariantPrice: { amount: '2400.00', currencyCode: 'USD' } },
  },
];

vi.mock('@/lib/shopify/client', () => ({
  getShopifyClient: vi.fn(() => ({
    execute: vi.fn(async () => ({
      search: {
        nodes: mockSearchResults,
      },
    })),
  })),
}));

describe('searchProducts', () => {
  it('returns empty array for query shorter than 2 characters', async () => {
    const { searchProducts } = await import('@/lib/shopify/search');
    const results = await searchProducts('a', 'en', 20);
    expect(results).toEqual([]);
  });

  it('returns empty array for empty query', async () => {
    const { searchProducts } = await import('@/lib/shopify/search');
    const results = await searchProducts('', 'en', 20);
    expect(results).toEqual([]);
  });

  it('returns search results for valid query', async () => {
    const { searchProducts } = await import('@/lib/shopify/search');
    const results = await searchProducts('silk', 'en', 20);
    expect(results).toHaveLength(2);
    expect(results[0]!.title).toBe('Silk Evening Gown');
    expect(results[1]!.title).toBe('Cashmere Coat');
  });

  it('returns products with correct structure', async () => {
    const { searchProducts } = await import('@/lib/shopify/search');
    const results = await searchProducts('luxury', 'en', 20);
    const product = results[0]!;
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('handle');
    expect(product).toHaveProperty('images');
    expect(product).toHaveProperty('priceRange');
    expect(product.images.nodes[0]).toHaveProperty('url');
  });
});

describe('searchProductsWithFormatting', () => {
  it('formats price in USD for en locale', async () => {
    const { searchProductsWithFormatting } = await import('@/lib/shopify/search');
    const results = await searchProductsWithFormatting('gown', 'en', 20);
    expect(results[0]!.formattedPrice).toBe('$1,200.00');
  });

  it('formats price in BRL for pt locale', async () => {
    const { searchProductsWithFormatting } = await import('@/lib/shopify/search');
    const results = await searchProductsWithFormatting('gown', 'pt', 20);
    expect(results[0]!.formattedPrice).toContain('R$');
    expect(results[0]!.formattedPrice).toContain('1.200');
  });
});