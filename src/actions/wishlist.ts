'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { getWishlistOwnerId } from '@/lib/auth/customer';
import { type WishlistStoredItem } from '@/lib/catalog/wishlist-seed';
import { formatPriceForLocale } from '@/lib/locale-currency';
import { logger } from '@/lib/logger';
import { getProductByHandle, getProductsByIds } from '@/lib/shopify/loader';
import type { ShopifyProductVariant } from '@/lib/shopify/types';
import {
  getWishlistProductGids,
  mergeGuestWishlistItems,
  resolveProductRefToGid,
  setWishlistProductGids,
  validateProductGids,
} from '@/lib/wishlist/metafield-storage';
import { isShopifyProductGid, uniqueProductGids } from '@/lib/wishlist/schema';

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

function productToWishlistItem(
  product: NonNullable<Awaited<ReturnType<typeof getProductByHandle>>>,
  locale: string,
): WishlistStoredItem {
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

function gidsToWishlistItems(gids: string[]): WishlistItem[] {
  const now = new Date().toISOString();
  return gids.map((productId) => ({ productId, addedAt: now }));
}

export async function toggleWishlist(
  _prevState: { success: boolean; message: string; items?: WishlistItem[]; requiresAuth?: boolean },
  formData: FormData
): Promise<{ success: boolean; message: string; items?: WishlistItem[]; requiresAuth?: boolean }> {
  const productRef = formData.get('productId') as string;
  const locale = (formData.get('locale') as string) || 'en';

  const parsed = toggleWishlistSchema.safeParse({ productId: productRef, locale });

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
    const productGid = await resolveProductRefToGid(parsed.data.productId, parsed.data.locale);
    if (!productGid) {
      return { success: false, message: 'Product not found' };
    }

    const gids = await getWishlistProductGids(parsed.data.locale);
    const wasMember = gids.includes(productGid);
    const nextGids = wasMember
      ? gids.filter((gid) => gid !== productGid)
      : uniqueProductGids([...gids, productGid]);

    const validated = await validateProductGids(nextGids, parsed.data.locale);
    const ok = await setWishlistProductGids(validated, parsed.data.locale, customerId);
    if (!ok) {
      return { success: false, message: 'Failed to update wishlist' };
    }

    logger.info(wasMember ? 'Removed from wishlist' : 'Added to wishlist', {
      customerId,
      productGid,
    });

    revalidateTag('wishlist');

    return {
      success: true,
      message: wasMember ? 'Removed from wishlist' : 'Added to wishlist',
      items: gidsToWishlistItems(validated),
    };
  } catch (error) {
    logger.error('Wishlist operation failed', { customerId, productRef, error });
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
    const gids = await getWishlistProductGids(resolvedLocale);
    return {
      success: true,
      items: gidsToWishlistItems(gids),
    };
  } catch (error) {
    logger.error('Failed to fetch wishlist', { customerId, error });
    return { success: false, items: [] };
  }
}

/** Merge guest localStorage items into the customer's Shopify metafield wishlist. */
export async function mergeGuestWishlist(
  guestItems: WishlistStoredItem[],
  locale: string,
): Promise<{ success: boolean; requiresAuth?: boolean }> {
  if (guestItems.length === 0) return { success: true };

  const result = await mergeGuestWishlistItems(guestItems, locale);
  if (result.requiresAuth) {
    return { success: false, requiresAuth: true };
  }
  if (result.success) {
    revalidateTag('wishlist');
  }
  return { success: result.success };
}

/** Product GIDs in customer metafield → live Shopify product cards. */
export async function getWishlistItems(locale: string): Promise<WishlistStoredItem[]> {
  const { success, items, requiresAuth } = await getWishlist(locale);
  if (requiresAuth || !success || items.length === 0) return [];

  const gids = items.map((item) => item.productId).filter(isShopifyProductGid);
  const products = await getProductsByIds(gids, locale);

  return products
    .filter(Boolean)
    .map((product) => productToWishlistItem(product!, locale));
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
      const product =
        item.productId && isShopifyProductGid(item.productId)
          ? (await getProductsByIds([item.productId], locale))[0]
          : await getProductByHandle(item.handle, locale);
      if (product) return productToWishlistItem(product, locale);
      return item;
    })
  );
}
