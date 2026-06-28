import { describe, it, expect } from 'vitest';

import type { LuxuryMetafields, ShopifyProduct } from '@/lib/shopify/types';

describe('LuxuryMetafields type', () => {
  it('should allow optional fields', () => {
    const metafields: LuxuryMetafields = {};
    expect(metafields.certificateHash).toBeUndefined();
    expect(metafields.materials).toBeUndefined();
  });

  it('should allow all fields', () => {
    const metafields: LuxuryMetafields = {
      certificateHash: 'abc123',
      materials: ['Silk', 'Cashmere'],
      madeIn: 'Italy',
      video360Url: 'https://example.com/video.mp4',
      limitedEditionNumber: 42,
      careInstructions: 'Dry clean only',
      averageRating: 4.8,
      totalReviews: 150,
    };

    expect(metafields.certificateHash).toBe('abc123');
    expect(metafields.materials).toHaveLength(2);
    expect(metafields.limitedEditionNumber).toBe(42);
    expect(metafields.averageRating).toBe(4.8);
  });

  it('should accept string array for materials', () => {
    const metafields: LuxuryMetafields = {
      materials: ['Leather', 'Gold'],
    };
    expect(metafields.materials).toEqual(['Leather', 'Gold']);
  });

  it('should accept single string converted to array', () => {
    const materials = 'Diamond';
    const metafields: LuxuryMetafields = {
      materials: [materials],
    };
    expect(metafields.materials).toEqual(['Diamond']);
  });
});

describe('ShopifyProduct type', () => {
  it('should structure product correctly', () => {
    const product: ShopifyProduct = {
      id: 'gid://shopify/Product/123',
      title: 'Luxury Watch',
      description: 'A premium timepiece',
      handle: 'luxury-watch',
      vendor: 'Rolex',
      images: {
        nodes: [
          { url: 'https://example.com/img1.jpg', altText: 'Watch front' },
          { url: 'https://example.com/img2.jpg', altText: null },
        ],
      },
      priceRange: {
        minVariantPrice: { amount: '5000.00', currencyCode: 'USD' },
      },
      variants: {
        nodes: [{ id: 'gid://shopify/ProductVariant/1', price: { amount: '5000.00' } }],
      },
      metafields: [],
    };

    expect(product.id).toContain('shopify');
    expect(product.images.nodes).toHaveLength(2);
    expect(product.priceRange.minVariantPrice.currencyCode).toBe('USD');
    expect(product.variants.nodes[0]!.price.amount).toBe('5000.00');
  });

  it('should allow empty metafields', () => {
    const product: ShopifyProduct = {
      id: 'gid://shopify/Product/123',
      title: 'Test',
      description: 'Test desc',
      handle: 'test',
      vendor: 'Test',
      images: { nodes: [] },
      priceRange: { minVariantPrice: { amount: '0', currencyCode: 'USD' } },
      variants: { nodes: [] },
      metafields: [],
    };

    expect(product.metafields).toHaveLength(0);
  });
});