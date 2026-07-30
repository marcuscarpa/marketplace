export const WISHLIST_METAFIELD_VERSION = 1 as const;

export interface WishlistMetafieldV1 {
  version: typeof WISHLIST_METAFIELD_VERSION;
  items: string[];
}

const SHOPIFY_PRODUCT_GID = /^gid:\/\/shopify\/Product\/\d+$/;

export function isShopifyProductGid(value: string): boolean {
  return SHOPIFY_PRODUCT_GID.test(value);
}

export function uniqueProductGids(gids: string[]): string[] {
  const seen = new Set<string>();
  return gids.filter((gid) => {
    if (!isShopifyProductGid(gid) || seen.has(gid)) return false;
    seen.add(gid);
    return true;
  });
}

export function serializeWishlistMetafield(gids: string[]): string {
  const payload: WishlistMetafieldV1 = {
    version: WISHLIST_METAFIELD_VERSION,
    items: uniqueProductGids(gids),
  };
  return JSON.stringify(payload);
}

/** Parse metafield JSON — supports v1 envelope and legacy bare arrays. */
export function parseWishlistMetafield(raw: string | null | undefined): {
  gids: string[];
  legacyHandles: string[];
} {
  if (!raw) return { gids: [], legacyHandles: [] };

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (
      parsed &&
      typeof parsed === 'object' &&
      'version' in parsed &&
      (parsed as WishlistMetafieldV1).version === WISHLIST_METAFIELD_VERSION &&
      Array.isArray((parsed as WishlistMetafieldV1).items)
    ) {
      const items = (parsed as WishlistMetafieldV1).items;
      return {
        gids: uniqueProductGids(items.filter(isShopifyProductGid)),
        legacyHandles: items.filter(
          (item): item is string => typeof item === 'string' && item.length > 0 && !isShopifyProductGid(item),
        ),
      };
    }

    if (Array.isArray(parsed)) {
      const gids = uniqueProductGids(parsed.filter(isShopifyProductGid));
      const legacyHandles = parsed.filter(
        (item): item is string => typeof item === 'string' && item.length > 0 && !isShopifyProductGid(item),
      );
      return { gids, legacyHandles };
    }

    return { gids: [], legacyHandles: [] };
  } catch {
    return { gids: [], legacyHandles: [] };
  }
}
