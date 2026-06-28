import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getShopifyClient, isShopifyConfigured } from '@/lib/shopify/client';
import { GET_CART } from '@/lib/shopify/queries';
import { ShopifyCart } from '@/lib/shopify/types';
import { logger } from '@/lib/logger';

const CART_COOKIE = 'shopify_cart_id';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  if (!isShopifyConfigured(locale)) {
    redirect(`/${locale}/cart`);
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    redirect(`/${locale}/cart`);
  }

  try {
    const client = getShopifyClient(locale);
    const result = await client.execute<{ cart: ShopifyCart | null }>(GET_CART, { cartId });

    if (result?.cart?.checkoutUrl) {
      redirect(result.checkoutUrl);
    }
  } catch (error) {
    logger.error('GET /api/cart/checkout failed', { cartId, error });
  }

  redirect(`/${locale}/cart`);
}
