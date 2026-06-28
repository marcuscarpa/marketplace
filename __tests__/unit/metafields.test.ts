import { describe, it, expect } from 'vitest';

import { parseLuxuryMetafields } from '@/lib/shopify/metafields';

describe('parseLuxuryMetafields', () => {
  it('parses materials as JSON array', () => {
    const metafields = [
      { namespace: 'luxury', key: 'materials', value: '["Silk", "Cashmere"]', type: 'json' },
    ];
    const result = parseLuxuryMetafields(metafields);
    expect(result.materials).toEqual(['Silk', 'Cashmere']);
  });

  it('falls back to single string for materials', () => {
    const metafields = [
      { namespace: 'luxury', key: 'materials', value: 'Leather', type: 'single_line_text_field' },
    ];
    const result = parseLuxuryMetafields(metafields);
    expect(result.materials).toEqual(['Leather']);
  });

  it('parses limitedEditionNumber', () => {
    const metafields = [
      { namespace: 'luxury', key: 'limited_edition_number', value: '42', type: 'number_integer' },
    ];
    const result = parseLuxuryMetafields(metafields);
    expect(result.limitedEditionNumber).toBe(42);
  });

  it('ignores invalid limitedEditionNumber', () => {
    const metafields = [
      { namespace: 'luxury', key: 'limited_edition_number', value: 'abc', type: 'number_integer' },
    ];
    const result = parseLuxuryMetafields(metafields);
    expect(result.limitedEditionNumber).toBeUndefined();
  });

  it('parses averageRating within range', () => {
    const metafields = [
      { namespace: 'reviews', key: 'average_rating', value: '4.7', type: 'number_decimal' },
    ];
    const result = parseLuxuryMetafields(metafields);
    expect(result.averageRating).toBe(4.7);
  });

  it('ignores out-of-range averageRating', () => {
    const metafields = [
      { namespace: 'reviews', key: 'average_rating', value: '6.0', type: 'number_decimal' },
    ];
    const result = parseLuxuryMetafields(metafields);
    expect(result.averageRating).toBeUndefined();
  });

  it('parses totalReviews', () => {
    const metafields = [
      { namespace: 'reviews', key: 'total_reviews', value: '100', type: 'number_integer' },
    ];
    const result = parseLuxuryMetafields(metafields);
    expect(result.totalReviews).toBe(100);
  });

  it('returns undefined for missing metafields', () => {
    const metafields: any[] = [];
    const result = parseLuxuryMetafields(metafields);
    expect(result.materials).toBeUndefined();
    expect(result.madeIn).toBeUndefined();
    expect(result.limitedEditionNumber).toBeUndefined();
  });
});