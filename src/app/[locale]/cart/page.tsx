import { notFound } from 'next/navigation';

import { CartBagPage } from '@/components/luxury/cart-bag-page';
import { isCartKillSwitchActive, isCheckoutKillSwitchActive } from '@/lib/feature-flags';
import { serializeCartWithImages } from '@/lib/cart/enrich-images';
import { getMockCart } from '@/lib/catalog/minicart-mock';
import { getCartPageRecommendations } from '@/lib/shopify/cart-recommendations';
import { getShopifyClient, isShopifyConfigured } from '@/lib/shopify/client';
import { GET_CART } from '@/lib/shopify/queries';
import { ShopifyCart } from '@/lib/shopify/types';

interface CartPageProps {
  params: Promise<{ locale: string }>;
}

async function getCartData(locale: string): Promise<ShopifyCart | null> {
  const cookieStore = await import('next/headers').then((m) => m.cookies());
  const cartId = cookieStore.get('shopify_cart_id')?.value;

  if (!cartId) return null;

  try {
    const client = getShopifyClient(locale);
    const result = await client.execute<{ cart: ShopifyCart | null }>(GET_CART, { cartId });
    return result?.cart ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: CartPageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Saco | Sinesia Karol' : 'Bag | Sinesia Karol',
    description: locale === 'pt' ? 'O seu saco de compras' : 'Your shopping bag',
  };
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'pt') notFound();

  if (!isShopifyConfigured(locale)) {
    const mock = getMockCart(locale);
    const recommendations = await getCartPageRecommendations(locale, mock.lines);
    return (
      <CartBagPage
        locale={locale}
        lines={mock.lines}
        subtotal={mock.cost?.subtotalAmount ?? null}
        totalQuantity={mock.totalQuantity}
        checkoutDisabled={false}
        cartDisabled={false}
        isMockCart
        recommendations={recommendations}
      />
    );
  }

  const cart = await getCartData(locale);
  const flagContext = { locale, region: locale === 'pt' ? 'BR' : 'US' };
  const [cartDisabled, checkoutDisabled] = await Promise.all([
    isCartKillSwitchActive(flagContext),
    isCheckoutKillSwitchActive(flagContext),
  ]);

  const serialized = cart ? await serializeCartWithImages(cart, locale) : null;
  const lines = serialized?.lines ?? [];
  const recommendations = await getCartPageRecommendations(locale, lines);

  return (
    <CartBagPage
      locale={locale}
      lines={lines}
      subtotal={serialized?.cost?.subtotalAmount ?? null}
      totalQuantity={serialized?.totalQuantity ?? 0}
      checkoutDisabled={checkoutDisabled}
      cartDisabled={cartDisabled}
      recommendations={recommendations}
    />
  );
}
