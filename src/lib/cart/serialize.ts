import type { CartLine, ShopifyCart } from '@/lib/shopify/types';

export interface CartLineItem {
  id: string;
  quantity: number;
  variantId: string;
  productId: string;
  variantTitle: string;
  productTitle: string;
  handle: string;
  imageUrl: string | null;
  imageAlt: string | null;
  price: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
  quantityAvailable?: number | null;
}

export function serializeCartLine(line: CartLine): CartLineItem {
  const image = line.merchandise.product.images.nodes[0];
  return {
    id: line.id,
    quantity: line.quantity,
    variantId: line.merchandise.id,
    productId: line.merchandise.product.id,
    variantTitle: line.merchandise.title,
    productTitle: line.merchandise.product.title,
    handle: line.merchandise.product.handle,
    imageUrl: image?.url ?? null,
    imageAlt: image?.altText ?? line.merchandise.product.title,
    price: line.merchandise.price,
    selectedOptions: line.merchandise.selectedOptions ?? [],
    quantityAvailable: line.merchandise.quantityAvailable ?? null,
  };
}

export function serializeCart(cart: ShopifyCart) {
  return {
    id: cart.id,
    totalQuantity: cart.totalQuantity,
    checkoutUrl: cart.checkoutUrl,
    cost: cart.cost,
    lines: cart.lines.nodes.map(serializeCartLine),
  };
}

export function formatCartPrice(amount: string, currency: string, locale: string) {
  return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}
