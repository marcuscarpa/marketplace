'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { z } from 'zod';

import { getRedisClient } from '@/lib/redis/client';
import { logger } from '@/lib/logger';
import { checkRateLimit } from '@/lib/security/bot-protection';
import { isCatalogMockVariantId } from '@/lib/shopify/catalog-mock';
import { getShopifyClient } from '@/lib/shopify/client';
import { CART_CREATE, CART_LINES_ADD, CART_LINES_UPDATE, CART_LINES_REMOVE } from '@/lib/shopify/queries';
import { ShopifyCart } from '@/lib/shopify/types';
import { serializeCartWithImages } from '@/lib/cart/enrich-images';
import { serializeCart } from '@/lib/cart/serialize';
import type { CartLineItem } from '@/lib/cart/display';
import { m } from '@/lib/i18n';
import { buildCartBuyerIdentityInput, ensureCartBuyerIdentity } from '@/lib/cart/buyer-identity';
import {
  getCartPageRecommendations,
  type CartCarouselItem,
} from '@/lib/shopify/cart-recommendations';

const CART_COOKIE = 'shopify_cart_id';

const addToCartSchema = z.object({
  variantId: z.string().startsWith('gid://shopify/ProductVariant/'),
  quantity: z.coerce.number().int().min(1).max(99),
  locale: z.string().default('en'),
});

const updateCartLinesSchema = z.object({
  lineId: z.string().min(1, 'Line ID is required'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be at least 0').max(99),
  locale: z.string().default('en'),
});

const removeFromCartSchema = z.object({
  lineId: z.string().min(1, 'Line ID is required'),
  locale: z.string().default('en'),
});

export interface CartActionState {
  success: boolean;
  message: string;
  cart?: {
    id: string;
    totalQuantity: number;
    checkoutUrl?: string;
    cost?: {
      totalAmount: { amount: string; currencyCode: string };
      subtotalAmount: { amount: string; currencyCode: string };
      totalTaxAmount: { amount: string; currencyCode: string } | null;
    };
    lines?: CartLineItem[];
  };
}

async function invalidateCartCache(cartId: string, locale?: string): Promise<void> {
  try {
    revalidateTag('cart');
    if (locale) {
      revalidatePath(`/${locale}/cart`);
    }
  } catch (error) {
    logger.warn('invalidateCartCache revalidation failed', { cartId, error: formatActionError(error) });
  }

  try {
    const redis = getRedisClient();
    await redis.del(`cart:${cartId}`);
  } catch {
    // Redis unavailable, next request will fetch fresh
  }
}

async function executeCartMutation<T>(
  locale: string,
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const client = getShopifyClient(locale);
  return client.execute<T>(query, variables);
}

async function checkCartRateLimit(locale: string): Promise<string | null> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? headersList.get('x-real-ip')
    ?? 'unknown';
  const result = await checkRateLimit(ip);
  if (result.blocked) {
    return m(locale).cart.rateLimit;
  }
  return null;
}

function formatActionError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function isStaleCartMessage(message: string): boolean {
  return /cart.*(not found|does not exist|invalid|expired|no longer available)/i.test(message);
}

function clearCartCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): void {
  cookieStore.set(CART_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

async function safeSerializeCart(cart: ShopifyCart, locale: string) {
  try {
    return await serializeCartWithImages(cart, locale);
  } catch (error) {
    logger.warn('serializeCartWithImages failed, using basic cart', {
      cartId: cart.id,
      error: formatActionError(error),
    });
    return serializeCart(cart);
  }
}

async function safeBuildCartBuyerIdentityInput(locale: string) {
  try {
    return await buildCartBuyerIdentityInput(locale);
  } catch (error) {
    logger.warn('buildCartBuyerIdentityInput failed', { error: formatActionError(error) });
    return undefined;
  }
}

async function finalizeCartSuccess(
  cart: ShopifyCart,
  locale: string,
  message: string,
): Promise<CartActionState> {
  try {
    await ensureCartBuyerIdentity(locale);
  } catch (error) {
    logger.warn('ensureCartBuyerIdentity failed', { cartId: cart.id, error: formatActionError(error) });
  }

  await invalidateCartCache(cart.id, locale);

  return {
    success: true,
    message,
    cart: await safeSerializeCart(cart, locale),
  };
}

export async function addToCartAction(
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const locale = (formData.get('locale') as string) || 'en';
  const cartMsg = m(locale).cart;

  const rateLimitMessage = await checkCartRateLimit(locale);
  if (rateLimitMessage) {
    return { success: false, message: rateLimitMessage };
  }

  const variantId = formData.get('variantId') as string;
  const quantity = formData.get('quantity') as string;

  const parsed = addToCartSchema.safeParse({ variantId, quantity, locale });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  if (isCatalogMockVariantId(parsed.data.variantId)) {
    return { success: false, message: cartMsg.addFailed };
  }

  const cookieStore = await cookies();
  const existingCartId = cookieStore.get(CART_COOKIE)?.value;

  try {
    if (existingCartId) {
      try {
        const result = await executeCartMutation<{ cartLinesAdd: { cart: ShopifyCart | null; userErrors: Array<{ field: string; message: string }> } }>(
          locale,
          CART_LINES_ADD,
          {
            cartId: existingCartId,
            lines: [{ merchandiseId: parsed.data.variantId, quantity: parsed.data.quantity }],
          }
        );

        if (result.cartLinesAdd.userErrors.length > 0) {
          const message = result.cartLinesAdd.userErrors.map((e) => e.message).join(', ');
          if (isStaleCartMessage(message)) {
            logger.warn('addToCartAction: stale cart cookie, creating new cart', {
              cartId: existingCartId,
              message,
            });
            clearCartCookie(cookieStore);
          } else {
            return { success: false, message };
          }
        } else if (result.cartLinesAdd.cart) {
          return finalizeCartSuccess(result.cartLinesAdd.cart, locale, cartMsg.added);
        } else {
          logger.warn('addToCartAction: cartLinesAdd returned null cart, creating new cart', {
            cartId: existingCartId,
          });
          clearCartCookie(cookieStore);
        }
      } catch (error) {
        logger.warn('addToCartAction: cartLinesAdd failed, creating new cart', {
          cartId: existingCartId,
          error: formatActionError(error),
        });
        clearCartCookie(cookieStore);
      }
    }

    const buyerIdentity = await safeBuildCartBuyerIdentityInput(locale);

    const result = await executeCartMutation<{ cartCreate: { cart: ShopifyCart | null; userErrors: Array<{ field: string; message: string }> } }>(
      locale,
      CART_CREATE,
      {
        input: {
          lines: [{ merchandiseId: parsed.data.variantId, quantity: parsed.data.quantity }],
          ...(buyerIdentity ? { buyerIdentity } : {}),
        },
      }
    );

    if (result.cartCreate.userErrors.length > 0) {
      return {
        success: false,
        message: result.cartCreate.userErrors.map((e) => e.message).join(', '),
      };
    }

    const cart = result.cartCreate.cart;
    if (cart) {
      try {
        cookieStore.set(CART_COOKIE, cart.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
      } catch (error) {
        logger.warn('addToCartAction: failed to persist cart cookie', {
          cartId: cart.id,
          error: formatActionError(error),
        });
      }

      const success = await finalizeCartSuccess(cart, locale, cartMsg.createAndAdded);
      return success;
    }

    logger.warn('addToCartAction: cart null after create', { result: result.cartCreate });
    return { success: false, message: cartMsg.createFailed };
  } catch (error) {
    logger.error('addToCartAction failed', {
      variantId: parsed.data.variantId,
      error: formatActionError(error),
    });
    return {
      success: false,
      message: cartMsg.addFailed,
    };
  }
}

export async function updateCartLinesAction(
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const locale = (formData.get('locale') as string) || 'en';
  const cartMsg = m(locale).cart;

  const rateLimitMessage = await checkCartRateLimit(locale);
  if (rateLimitMessage) {
    return { success: false, message: rateLimitMessage };
  }

  const lineId = formData.get('lineId') as string;
  const quantity = formData.get('quantity') as string;

  const parsed = updateCartLinesSchema.safeParse({ lineId, quantity, locale });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  if (parsed.data.quantity === 0) {
    const removeFormData = new FormData();
    removeFormData.set('lineId', parsed.data.lineId);
    removeFormData.set('locale', parsed.data.locale);
    return removeFromCartAction(prevState, removeFormData);
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return { success: false, message: cartMsg.notFound };
  }

  try {
    const result = await executeCartMutation<{ cartLinesUpdate: { cart: ShopifyCart | null; userErrors: Array<{ field: string; message: string }> } }>(
      locale,
      CART_LINES_UPDATE,
      {
        cartId,
        lines: [{ id: parsed.data.lineId, quantity: parsed.data.quantity }],
      }
    );

    if (result.cartLinesUpdate.userErrors.length > 0) {
      return {
        success: false,
        message: result.cartLinesUpdate.userErrors.map((e) => e.message).join(', '),
      };
    }

    const cart = result.cartLinesUpdate.cart;
    if (cart) {
      await invalidateCartCache(cart.id, parsed.data.locale);
      return {
        success: true,
        message: cartMsg.updated,
        cart: await serializeCartWithImages(cart, parsed.data.locale),
      };
    }

    logger.warn('updateCartLinesAction: cart null after update', { result: result.cartLinesUpdate });
    return { success: false, message: cartMsg.updateFailed };
  } catch (error) {
    logger.error('updateCartLinesAction failed', { lineId: parsed.data.lineId, error });
    return { success: false, message: cartMsg.error };
  }
}

export async function removeFromCartAction(
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const locale = (formData.get('locale') as string) || 'en';
  const cartMsg = m(locale).cart;

  const rateLimitMessage = await checkCartRateLimit(locale);
  if (rateLimitMessage) {
    return { success: false, message: rateLimitMessage };
  }

  const lineId = formData.get('lineId') as string;

  const parsed = removeFromCartSchema.safeParse({ lineId, locale });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return { success: false, message: cartMsg.notFound };
  }

  try {
    const result = await executeCartMutation<{ cartLinesRemove: { cart: ShopifyCart | null; userErrors: Array<{ field: string; message: string }> } }>(
      locale,
      CART_LINES_REMOVE,
      {
        cartId,
        lineIds: [parsed.data.lineId],
      }
    );

    if (result.cartLinesRemove.userErrors.length > 0) {
      return {
        success: false,
        message: result.cartLinesRemove.userErrors.map((e) => e.message).join(', '),
      };
    }

    const cart = result.cartLinesRemove.cart;
    if (cart) {
      await invalidateCartCache(cart.id, parsed.data.locale);
      return {
        success: true,
        message: cartMsg.removed,
        cart: await serializeCartWithImages(cart, parsed.data.locale),
      };
    }

    logger.warn('removeFromCartAction: cart null after remove', { result: result.cartLinesRemove });
    return { success: false, message: cartMsg.removeFailed };
  } catch (error) {
    logger.error('removeFromCartAction failed', { lineId: parsed.data.lineId, error });
    return { success: false, message: cartMsg.error };
  }
}

export async function getCartRecommendationsAction(
  locale: string,
  lines: CartLineItem[]
): Promise<CartCarouselItem[]> {
  try {
    return await getCartPageRecommendations(locale, lines);
  } catch (error) {
    logger.warn('getCartRecommendationsAction failed', { error });
    return [];
  }
}
