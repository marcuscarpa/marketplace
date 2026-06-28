import { getAllCatalogProducts } from '@/lib/catalog/catalog';
import type { CatalogProduct } from '@/lib/catalog/data';

export function getCatalogRecommendations(excludeHandle: string, limit = 4): CatalogProduct[] {
  return getAllCatalogProducts()
    .filter((p) => p.handle !== excludeHandle)
    .slice(0, limit);
}

export function catalogProductToRecommendation(product: CatalogProduct) {
  const amount = product.price.replace(/[^\d]/g, '') || '0';
  return {
    id: `catalog-${product.handle}`,
    title: product.title,
    handle: product.handle,
    images: { nodes: [{ url: product.image, altText: product.title }] },
    priceRange: { minVariantPrice: { amount, currencyCode: 'EUR' } },
  };
}
