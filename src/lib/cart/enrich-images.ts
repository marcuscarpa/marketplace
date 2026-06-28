import type { CartLineItem } from '@/lib/cart/display';
import { serializeCart } from '@/lib/cart/serialize';
import { isShopifyConfigured } from '@/lib/shopify/client';
import { getProductByHandle } from '@/lib/shopify/loader';
import type { ShopifyCart } from '@/lib/shopify/types';

/** Fill missing cart thumbnails from Shopify product query (cart API often omits media). */
export async function enrichCartLineImages(
  lines: CartLineItem[],
  locale: string
): Promise<CartLineItem[]> {
  if (!isShopifyConfigured(locale)) return lines;

  return Promise.all(
    lines.map(async (line) => {
      if (line.imageUrl) return line;
      const product = await getProductByHandle(line.handle, locale);
      const image = product?.images?.nodes?.[0];
      if (!image?.url) return line;
      return {
        ...line,
        imageUrl: image.url,
        imageAlt: image.altText ?? line.productTitle,
      };
    })
  );
}

export async function serializeCartWithImages(cart: ShopifyCart, locale: string) {
  const serialized = serializeCart(cart);
  return {
    ...serialized,
    lines: await enrichCartLineImages(serialized.lines, locale),
  };
}
