import { formatCartPrice, type CartLineItem } from '@/lib/cart/serialize';
import { getCatalogRecommendations } from '@/lib/catalog/recommendations';
import { MINICART_RECOMMENDATIONS } from '@/lib/catalog/minicart-mock';

import { isShopifyConfigured } from './client';
import { getProductRecommendations } from './recommendations';

export interface CartCarouselItem {
  handle: string;
  title: string;
  image: string;
  price: string;
}

export async function getCartPageRecommendations(
  locale: string,
  lines: CartLineItem[],
  limit = 8
): Promise<CartCarouselItem[]> {
  const exclude = new Set(lines.map((l) => l.handle));
  const anchor = lines[0];

  if (anchor?.productId && isShopifyConfigured(locale)) {
    try {
      const shopify = await getProductRecommendations(anchor.productId, locale, limit + exclude.size);
      const items = shopify
        .filter((p) => !exclude.has(p.handle))
        .slice(0, limit)
        .map((p) => ({
          handle: p.handle,
          title: p.title,
          image: p.images.nodes[0]?.url ?? '',
          price: formatCartPrice(
            p.priceRange.minVariantPrice.amount,
            p.priceRange.minVariantPrice.currencyCode,
            locale
          ),
        }));
      if (items.length > 0) return items;
    } catch {
      // ponytail: fall through to local catalog
    }
  }

  const catalog = getCatalogRecommendations(anchor?.handle ?? '', limit + exclude.size)
    .filter((p) => !exclude.has(p.handle))
    .slice(0, limit);
  if (catalog.length > 0) {
    return catalog.map((p) => ({
      handle: p.handle,
      title: p.title,
      image: p.image,
      price: p.price,
    }));
  }

  return MINICART_RECOMMENDATIONS.filter((p) => !exclude.has(p.handle)).slice(0, limit);
}
