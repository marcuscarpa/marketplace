import type { WishlistStoredItem } from '@/lib/catalog/wishlist-seed';
import { normalizeWishlistItems } from '@/lib/catalog/wishlist-seed';
import { getWishlistOwnerId } from '@/lib/auth/customer';
import { logger } from '@/lib/logger';
import { getRedisClient } from '@/lib/redis/client';
import { getProductByHandle, getProductsByIds } from '@/lib/shopify/loader';
import { executeCustomerAccountQuery } from '@/lib/shopify/customer-account-client';
import {
  GET_CUSTOMER_WISHLIST_METAFIELD,
  SET_CUSTOMER_METAFIELDS,
  WISHLIST_METAFIELD_KEY,
  WISHLIST_METAFIELD_NAMESPACE,
  WISHLIST_METAFIELD_TYPE,
} from '@/lib/shopify/customer-account-queries';
import {
  isShopifyProductGid,
  parseWishlistMetafield,
  serializeWishlistMetafield,
  uniqueProductGids,
} from '@/lib/wishlist/schema';

/** Requires Shopify Admin metafield definition: custom.wishlist (type: json). */

interface WishlistMetafieldQuery {
  customer: {
    id: string;
    metafield: { value: string } | null;
  } | null;
}

interface MetafieldsSetMutation {
  metafieldsSet: {
    metafields: Array<{ namespace: string; key: string; value: string }> | null;
    userErrors: Array<{ field: string[] | null; message: string; code: string | null }>;
  } | null;
}

async function readRawMetafield(locale: string, accessTokenOverride?: string): Promise<string | null> {
  const data = await executeCustomerAccountQuery<WishlistMetafieldQuery>(
    locale,
    GET_CUSTOMER_WISHLIST_METAFIELD,
    undefined,
    accessTokenOverride,
  );
  return data.customer?.metafield?.value ?? null;
}

export async function resolveHandleToProductGid(handle: string, locale: string): Promise<string | null> {
  const product = await getProductByHandle(handle, locale);
  if (!product?.id || !isShopifyProductGid(product.id)) return null;
  return product.id;
}

export async function resolveProductRefToGid(
  ref: string,
  locale: string,
): Promise<string | null> {
  if (isShopifyProductGid(ref)) {
    const products = await getProductsByIds([ref], locale);
    return products[0]?.id && isShopifyProductGid(products[0].id) ? products[0].id : null;
  }
  return resolveHandleToProductGid(ref, locale);
}

/** Keep only GIDs that still resolve to live Shopify products. */
export async function validateProductGids(gids: string[], locale: string): Promise<string[]> {
  const unique = uniqueProductGids(gids);
  if (unique.length === 0) return [];

  const products = await getProductsByIds(unique, locale);
  return unique.filter((gid, index) => {
    const product = products[index];
    return Boolean(product?.id && isShopifyProductGid(product.id));
  });
}

async function resolveLegacyHandles(handles: string[], locale: string): Promise<string[]> {
  const resolved = await Promise.all(handles.map((handle) => resolveHandleToProductGid(handle, locale)));
  return uniqueProductGids(resolved.filter(Boolean) as string[]);
}

async function migrateLegacyRedisWishlist(customerId: string): Promise<string[]> {
  try {
    const redis = getRedisClient();
    const legacyKey = `wishlist:${customerId}`;
    const legacy = await redis.smembers(legacyKey);
    if (legacy.length === 0) return [];
    await redis.del(legacyKey);
    logger.info('Migrated legacy Redis wishlist handles', { customerId, count: legacy.length });
    return legacy;
  } catch {
    return [];
  }
}

async function parseAndNormalizeMetafield(
  raw: string | null,
  locale: string,
): Promise<string[]> {
  const { gids, legacyHandles } = parseWishlistMetafield(raw);
  const fromHandles = legacyHandles.length > 0 ? await resolveLegacyHandles(legacyHandles, locale) : [];
  const combined = uniqueProductGids([...gids, ...fromHandles]);
  return validateProductGids(combined, locale);
}

export async function getWishlistProductGids(locale: string): Promise<string[]> {
  const customerId = await getWishlistOwnerId(locale);
  if (!customerId) return [];

  try {
    const raw = await readRawMetafield(locale);
    if (raw) {
      const gids = await parseAndNormalizeMetafield(raw, locale);
      if (gids.length > 0) return gids;

      const { legacyHandles } = parseWishlistMetafield(raw);
      if (legacyHandles.length > 0) {
        await setWishlistProductGids([], locale, customerId);
      }
    }

    const legacyHandles = await migrateLegacyRedisWishlist(customerId);
    if (legacyHandles.length > 0) {
      const gids = await validateProductGids(
        await resolveLegacyHandles(legacyHandles, locale),
        locale,
      );
      if (gids.length > 0) {
        await setWishlistProductGids(gids, locale, customerId);
      }
      return gids;
    }

    return [];
  } catch (error) {
    logger.error('Failed to read wishlist metafield', { customerId, error });
    const legacyHandles = await migrateLegacyRedisWishlist(customerId);
    return validateProductGids(await resolveLegacyHandles(legacyHandles, locale), locale);
  }
}

export async function setWishlistProductGids(
  gids: string[],
  locale: string,
  customerId: string,
  accessTokenOverride?: string,
): Promise<boolean> {
  const normalized = uniqueProductGids(gids);

  try {
    const data = await executeCustomerAccountQuery<MetafieldsSetMutation>(
      locale,
      SET_CUSTOMER_METAFIELDS,
      {
        metafields: [
          {
            ownerId: customerId,
            namespace: WISHLIST_METAFIELD_NAMESPACE,
            key: WISHLIST_METAFIELD_KEY,
            type: WISHLIST_METAFIELD_TYPE,
            value: serializeWishlistMetafield(normalized),
          },
        ],
      },
      accessTokenOverride,
    );

    const userErrors = data.metafieldsSet?.userErrors ?? [];
    if (userErrors.length > 0) {
      logger.error('metafieldsSet userErrors', { customerId, userErrors });
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Failed to write wishlist metafield', { customerId, error });
    return false;
  }
}

async function resolveGuestItemsToGids(
  guestItems: WishlistStoredItem[],
  locale: string,
): Promise<string[]> {
  const normalized = normalizeWishlistItems(guestItems);
  const refs = normalized.flatMap((item) => {
    if (item.productId && isShopifyProductGid(item.productId)) return [item.productId];
    return [item.handle];
  });

  const resolved = await Promise.all(refs.map((ref) => resolveProductRefToGid(ref, locale)));
  return uniqueProductGids(resolved.filter(Boolean) as string[]);
}

/** Full merge pipeline: normalize → dedupe → validate → merge → persist. */
export async function mergeGuestWishlistItems(
  guestItems: WishlistStoredItem[],
  locale: string,
): Promise<{ success: boolean; gids: string[]; requiresAuth?: boolean }> {
  const customerId = await getWishlistOwnerId(locale);
  if (!customerId) {
    return { success: false, gids: [], requiresAuth: true };
  }

  if (guestItems.length === 0) {
    return { success: true, gids: await getWishlistProductGids(locale) };
  }

  const incomingGids = await validateProductGids(
    await resolveGuestItemsToGids(guestItems, locale),
    locale,
  );
  const existingGids = await getWishlistProductGids(locale);
  const merged = uniqueProductGids([...existingGids, ...incomingGids]);
  const validated = await validateProductGids(merged, locale);

  const ok = await setWishlistProductGids(validated, locale, customerId);
  return { success: ok, gids: validated };
}
