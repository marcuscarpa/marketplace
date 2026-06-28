import type { CartLine, ShopifyCart } from '@/lib/shopify/types';
import { getCatalogProductByHandle } from '@/lib/catalog/catalog';
import type { CartLineItem } from '@/lib/cart/display';

export type { CartLineItem } from '@/lib/cart/display';
export { formatCartPrice } from '@/lib/cart/display';

function pickCartLineImage(line: CartLine): { url: string | null; alt: string | null } {
  const { merchandise } = line;
  if (merchandise.image?.url) {
    return { url: merchandise.image.url, alt: merchandise.image.altText ?? merchandise.product.title };
  }
  if (merchandise.product.featuredImage?.url) {
    return {
      url: merchandise.product.featuredImage.url,
      alt: merchandise.product.featuredImage.altText ?? merchandise.product.title,
    };
  }
  const productImage = merchandise.product.images?.nodes?.[0];
  if (productImage?.url) {
    return { url: productImage.url, alt: productImage.altText ?? merchandise.product.title };
  }
  const catalog = getCatalogProductByHandle(merchandise.product.handle);
  if (catalog?.image) {
    return { url: catalog.image, alt: catalog.title };
  }
  return { url: null, alt: null };
}

export function serializeCartLine(line: CartLine): CartLineItem {
  const image = pickCartLineImage(line);
  return {
    id: line.id,
    quantity: line.quantity,
    variantId: line.merchandise.id,
    productId: line.merchandise.product.id,
    variantTitle: line.merchandise.title,
    productTitle: line.merchandise.product.title,
    handle: line.merchandise.product.handle,
    imageUrl: image.url,
    imageAlt: image.alt ?? line.merchandise.product.title,
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
