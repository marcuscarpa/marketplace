import { cookies } from 'next/headers';

import { getSessionCustomer } from '@/lib/auth/customer';
import { logger } from '@/lib/logger';
import { getShopifyClient } from '@/lib/shopify/client';
import { CART_BUYER_IDENTITY_UPDATE } from '@/lib/shopify/queries';

export const CART_COOKIE = 'shopify_cart_id';

interface BuyerIdentityParams {
  locale: string;
  cartId: string;
  accessToken: string;
  email?: string;
}

export async function associateCartWithCustomer({
  locale,
  cartId,
  accessToken,
  email,
}: BuyerIdentityParams): Promise<boolean> {
  try {
    const client = getShopifyClient(locale);
    const result = await client.execute<{
      cartBuyerIdentityUpdate: {
        cart: { id: string } | null;
        userErrors: Array<{ field: string[] | null; message: string }>;
      };
    }>(CART_BUYER_IDENTITY_UPDATE, {
      cartId,
      buyerIdentity: {
        customerAccessToken: accessToken,
        ...(email ? { email } : {}),
      },
    });

    if (result.cartBuyerIdentityUpdate.userErrors.length > 0) {
      logger.warn('cartBuyerIdentityUpdate userErrors', {
        cartId,
        errors: result.cartBuyerIdentityUpdate.userErrors,
      });
      return false;
    }

    return Boolean(result.cartBuyerIdentityUpdate.cart);
  } catch (error) {
    logger.warn('associateCartWithCustomer failed', { cartId, error });
    return false;
  }
}

export async function ensureCartBuyerIdentity(locale: string): Promise<void> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  const accessToken = cookieStore.get('access_token')?.value;
  if (!cartId || !accessToken) return;

  const customer = await getSessionCustomer(locale);
  await associateCartWithCustomer({
    locale,
    cartId,
    accessToken,
    email: customer?.email,
  });
}

export async function buildCartBuyerIdentityInput(
  locale: string,
): Promise<{ customerAccessToken: string; email?: string } | undefined> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  if (!accessToken) return undefined;

  const customer = await getSessionCustomer(locale);
  return {
    customerAccessToken: accessToken,
    ...(customer?.email ? { email: customer.email } : {}),
  };
}
