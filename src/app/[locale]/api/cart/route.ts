import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { serializeCart } from '@/lib/cart/serialize';
import { getMockCart } from '@/lib/catalog/minicart-mock';
import { getShopifyClient, isShopifyConfigured } from '@/lib/shopify/client';
import { GET_CART } from '@/lib/shopify/queries';
import { ShopifyCart } from '@/lib/shopify/types';
import { logger } from '@/lib/logger';

const CART_COOKIE = 'shopify_cart_id';

const EMPTY = {
  id: null,
  totalQuantity: 0,
  checkoutUrl: null,
  cost: null,
  lines: [] as ReturnType<typeof serializeCart>['lines'],
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  if (!isShopifyConfigured(locale)) {
    return Response.json(getMockCart(locale));
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return Response.json(EMPTY);
  }

  try {
    const client = getShopifyClient(locale);
    const result = await client.execute<{ cart: ShopifyCart | null }>(GET_CART, { cartId });

    if (!result?.cart) {
      const response = NextResponse.json(EMPTY);
      response.cookies.set(CART_COOKIE, '', { path: '/', maxAge: 0 });
      return response;
    }

    return Response.json(serializeCart(result.cart));
  } catch (error) {
    logger.error('GET /api/cart failed', { cartId, error });
    return Response.json(EMPTY);
  }
}
