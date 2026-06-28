import {
  getCatalogRecommendations,
  catalogProductToRecommendation,
} from '@/lib/catalog/recommendations';

import { isShopifyConfigured } from './client';
import { getProductRecommendations } from './recommendations';

export interface PageRecommendation {
  id: string;
  title: string;
  handle: string;
  images: { nodes: Array<{ url: string; altText: string | null }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}

export async function getPageRecommendations(
  product: { id: string; handle: string },
  locale: string,
  limit = 4
): Promise<PageRecommendation[]> {
  const isCatalogMock = product.id.startsWith('catalog-');

  if (!isCatalogMock && isShopifyConfigured(locale)) {
    try {
      const shopify = await getProductRecommendations(product.id, locale, limit);
      if (shopify.length > 0) return shopify;
    } catch {
      // ponytail: fall through to static catalog
    }
  }

  return getCatalogRecommendations(product.handle, limit).map(catalogProductToRecommendation);
}
