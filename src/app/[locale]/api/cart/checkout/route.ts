import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getShopifyClient, isShopifyConfigured } from '@/lib/shopify/client';
import { GET_CART } from '@/lib/shopify/queries';
import { ShopifyCart } from '@/lib/shopify/types';
import { logger } from '@/lib/logger';

const CART_COOKIE = 'shopify_cart_id';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const fallbackUrl = new URL(`/${locale}/cart`, request.url);

  if (!isShopifyConfigured(locale)) {
    return NextResponse.redirect(fallbackUrl);
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return NextResponse.redirect(fallbackUrl);
  }

  try {
    const client = getShopifyClient(locale);
    const result = await client.execute<{ cart: ShopifyCart | null }>(GET_CART, { cartId });

    if (result?.cart?.checkoutUrl) {
      return NextResponse.redirect(result.cart.checkoutUrl);
    }
  } catch (error) {
    logger.error('GET /api/cart/checkout failed', { cartId, error });
  }

  return NextResponse.redirect(fallbackUrl);
}
