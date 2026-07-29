import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { serializeCartWithImages } from '@/lib/cart/enrich-images';
import type { CartLineItem } from '@/lib/cart/display';
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
  lines: [] as CartLineItem[],
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  try {
    const { locale } = await params;

    if (!isShopifyConfigured(locale)) {
      return Response.json(getMockCart(locale));
    }

    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE)?.value;

    if (!cartId) {
      return Response.json(EMPTY);
    }

    const client = getShopifyClient(locale);
    const result = await client.execute<{ cart: ShopifyCart | null }>(GET_CART, { cartId });

    if (!result?.cart) {
      const response = NextResponse.json(EMPTY);
      response.cookies.set(CART_COOKIE, '', { path: '/', maxAge: 0 });
      return response;
    }

    return Response.json(await serializeCartWithImages(result.cart, locale));
  } catch (error) {
    const { locale } = await params;
    logger.error('GET /api/cart failed', { error });
    if (!isShopifyConfigured(locale)) {
      return Response.json(getMockCart(locale));
    }
    return Response.json(EMPTY);
  }
}
