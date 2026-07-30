import { describe, expect, it } from 'vitest';

import {
  isShopifyProductGid,
  parseWishlistMetafield,
  serializeWishlistMetafield,
  uniqueProductGids,
} from '@/lib/wishlist/schema';

const GID_A = 'gid://shopify/Product/9123456789012';
const GID_B = 'gid://shopify/Product/9345678901234';

describe('isShopifyProductGid', () => {
  it('accepts valid product GIDs', () => {
    expect(isShopifyProductGid(GID_A)).toBe(true);
  });

  it('rejects handles and catalog ids', () => {
    expect(isShopifyProductGid('summer-shirt')).toBe(false);
    expect(isShopifyProductGid('catalog-summer-shirt')).toBe(false);
  });
});

describe('serializeWishlistMetafield', () => {
  it('writes versioned envelope with unique GIDs', () => {
    const raw = serializeWishlistMetafield([GID_A, GID_B, GID_A]);
    expect(JSON.parse(raw)).toEqual({
      version: 1,
      items: [GID_A, GID_B],
    });
  });
});

describe('parseWishlistMetafield', () => {
  it('parses version 1 envelope', () => {
    const raw = serializeWishlistMetafield([GID_A]);
    expect(parseWishlistMetafield(raw)).toEqual({ gids: [GID_A], legacyHandles: [] });
  });

  it('parses legacy bare GID array', () => {
    expect(parseWishlistMetafield(JSON.stringify([GID_A, GID_B]))).toEqual({
      gids: [GID_A, GID_B],
      legacyHandles: [],
    });
  });

  it('separates legacy handles from GIDs', () => {
    expect(parseWishlistMetafield(JSON.stringify([GID_A, 'summer-shirt']))).toEqual({
      gids: [GID_A],
      legacyHandles: ['summer-shirt'],
    });
  });

  it('returns empty for invalid JSON', () => {
    expect(parseWishlistMetafield('not-json')).toEqual({ gids: [], legacyHandles: [] });
  });
});

describe('uniqueProductGids', () => {
  it('deduplicates while preserving order', () => {
    expect(uniqueProductGids([GID_A, GID_B, GID_A])).toEqual([GID_A, GID_B]);
  });
});
