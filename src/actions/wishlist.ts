'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { type WishlistStoredItem } from '@/lib/catalog/wishlist-seed';
import { formatPriceForLocale } from '@/lib/locale-currency';
import { logger } from '@/lib/logger';
import { getRedisClient } from '@/lib/redis/client';
import { getProductByHandle } from '@/lib/shopify/loader';

const toggleWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  locale: z.string().default('en'),
});

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export async function toggleWishlist(
  _prevState: { success: boolean; message: string; items?: WishlistItem[] },
  formData: FormData
): Promise<{ success: boolean; message: string; items?: WishlistItem[] }> {
  const productId = formData.get('productId') as string;
  const locale = (formData.get('locale') as string) || 'en';

  const parsed = toggleWishlistSchema.safeParse({ productId, locale });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  const cookieStore = await cookies();
  let customerId = cookieStore.get('shopify_customer_id')?.value;

  if (!customerId) {
    let anonymousId = cookieStore.get('wishlist_anonymous_id')?.value;
    if (!anonymousId) {
      anonymousId = `guest:${crypto.randomUUID()}`;
      cookieStore.set('wishlist_anonymous_id', anonymousId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 90,
      });
    }
    customerId = anonymousId;
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
): Promise<{ success: boolean; items: WishlistItem[] }> {
  const cookieStore = await cookies();
  let customerId = cookieStore.get('shopify_customer_id')?.value;

  if (!customerId) {
    customerId = cookieStore.get('wishlist_anonymous_id')?.value ?? `guest:${crypto.randomUUID()}`;
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

/** Product handles in Redis → live Shopify product cards for header / account. */
export async function getWishlistItems(locale: string): Promise<WishlistStoredItem[]> {
  const { success, items } = await getWishlist(locale);
  if (!success || items.length === 0) return [];

  const handles = items.map((item) => item.productId);
  const products = await Promise.all(
    handles.map((handle) => getProductByHandle(handle, locale))
  );

  return products
    .filter(Boolean)
    .map((product) => ({
      id: product!.handle,
      handle: product!.handle,
      title: product!.title,
      price: formatPriceForLocale(product!.priceRange.minVariantPrice.amount, locale),
      image: product!.images.nodes[0]?.url ?? '',
    }));
}
