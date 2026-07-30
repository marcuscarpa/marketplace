'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { getWishlistOwnerId } from '@/lib/auth/customer';
import { type WishlistStoredItem } from '@/lib/catalog/wishlist-seed';
import { formatPriceForLocale } from '@/lib/locale-currency';
import { logger } from '@/lib/logger';
import { getRedisClient } from '@/lib/redis/client';
import { getProductByHandle } from '@/lib/shopify/loader';
import type { ShopifyProductVariant } from '@/lib/shopify/types';

const toggleWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  locale: z.string().default('en'),
});

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

function authRequiredMessage(locale: string): string {
  return locale === 'pt'
    ? 'Inicie sessão para usar a lista de desejos.'
    : 'Sign in to use your wishlist.';
}

function pickVariant(variants: ShopifyProductVariant[]): ShopifyProductVariant | undefined {
  return variants.find((v) => v.availableForSale !== false) ?? variants[0];
}

function variantLabel(variant: ShopifyProductVariant | undefined): string | undefined {
  if (!variant?.selectedOptions?.length) return undefined;
  return variant.selectedOptions.map((o) => o.value).join(' · ');
}

function wishlistBadge(
  variant: ShopifyProductVariant | undefined,
  totalInventory: number | null | undefined
): WishlistStoredItem['badge'] {
  if (variant?.availableForSale === false) return 'soldOut';
  if (totalInventory !== null && totalInventory !== undefined && totalInventory <= 0) return 'soldOut';
  const stock = variant?.quantityAvailable;
  if (stock !== null && stock !== undefined && stock > 0 && stock <= 3) return 'lowStock';
  return null;
}

function productToWishlistItem(product: NonNullable<Awaited<ReturnType<typeof getProductByHandle>>>, locale: string): WishlistStoredItem {
  const variant = pickVariant(product.variants.nodes);
  const images = product.images.nodes;
  const priceAmount = variant?.price.amount ?? product.priceRange.minVariantPrice.amount;
  const currencyCode = variant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode;

  return {
    id: product.handle,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor,
    price: formatPriceForLocale(priceAmount, locale),
    priceAmount,
    currencyCode,
    image: variant?.image?.url ?? images[0]?.url ?? '',
    hoverImage: images[1]?.url,
    variantId: variant?.id,
    productId: product.id,
    variantLabel: variantLabel(variant),
    availableForSale: variant?.availableForSale !== false,
    badge: wishlistBadge(variant, product.totalInventory),
  };
}

export async function toggleWishlist(
  _prevState: { success: boolean; message: string; items?: WishlistItem[]; requiresAuth?: boolean },
  formData: FormData
): Promise<{ success: boolean; message: string; items?: WishlistItem[]; requiresAuth?: boolean }> {
  const productId = formData.get('productId') as string;
  const locale = (formData.get('locale') as string) || 'en';

  const parsed = toggleWishlistSchema.safeParse({ productId, locale });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  const customerId = await getWishlistOwnerId(parsed.data.locale);
  if (!customerId) {
    return { success: false, message: authRequiredMessage(parsed.data.locale), requiresAuth: true };
  }

  try {
    const redis = getRedisClient();
    const wishlistKey = `wishlist:${customerId}`;

    const lua = `
      local key = KEYS[1]
      local member = ARGV[1]
      local ttl = tonumber(ARGV[2])
      local exists = redis.call('SISMEMBER', key, member)
      if exists == 1 then
        redis.call('SREM', key, member)
      else
        redis.call('SADD', key, member)
      end
      redis.call('EXPIRE', key, ttl)
      local items = redis.call('SMEMBERS', key)
      return items
    `;

    const wasMember = await redis.sismember(wishlistKey, parsed.data.productId);
    const items = await redis.eval(
      lua, 1, wishlistKey, parsed.data.productId, String(60 * 60 * 24 * 90)
    ) as string[];

    logger.info(wasMember ? 'Removed from wishlist' : 'Added to wishlist', { customerId, productId });

    revalidateTag('wishlist');

    return {
      success: true,
      message: wasMember ? 'Removed from wishlist' : 'Added to wishlist',
      items: items.map((id) => ({ productId: id, addedAt: new Date().toISOString() })),
    };
  } catch (error) {
    logger.error('Wishlist operation failed', { customerId, productId, error });
    return { success: false, message: 'Failed to update wishlist' };
  }
}

export async function getWishlist(
  locale?: string
): Promise<{ success: boolean; items: WishlistItem[]; requiresAuth?: boolean }> {
  const resolvedLocale = locale ?? 'en';
  const customerId = await getWishlistOwnerId(resolvedLocale);

  if (!customerId) {
    return { success: true, items: [], requiresAuth: true };
  }

  try {
    const redis = getRedisClient();
    const wishlistKey = `wishlist:${customerId}`;
    const items = await redis.smembers(wishlistKey);

    return {
      success: true,
      items: items.map((id) => ({ productId: id, addedAt: new Date().toISOString() })),
    };
  } catch (error) {
    logger.error('Failed to fetch wishlist', { customerId, error });
    return { success: false, items: [] };
  }
}

/** Product handles in Redis → live Shopify product cards for wishlist page / header. */
export async function getWishlistItems(locale: string): Promise<WishlistStoredItem[]> {
  const { success, items, requiresAuth } = await getWishlist(locale);
  if (requiresAuth || !success || items.length === 0) return [];

  const handles = items.map((item) => item.productId);
  const products = await Promise.all(handles.map((handle) => getProductByHandle(handle, locale)));

  return products.filter(Boolean).map((product) => productToWishlistItem(product!, locale));
}

/** Guest localStorage snapshots may omit images — refresh from Shopify when missing. */
export async function hydrateGuestWishlistItems(
  items: WishlistStoredItem[],
  locale: string
): Promise<WishlistStoredItem[]> {
  if (items.length === 0) return [];

  return Promise.all(
    items.map(async (item) => {
      if (item.image) return item;
      const product = await getProductByHandle(item.handle, locale);
      if (product) return productToWishlistItem(product, locale);
      return item;
    })
  );
}
