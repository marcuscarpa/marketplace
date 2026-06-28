import type { CatalogProduct } from '@/lib/catalog/data';
import { isShopifyConfigured } from '@/lib/shopify/client';
import { getProductsByHandles } from '@/lib/shopify/loader';

/** Attach Shopify's second product image as hoverImage when available. */
export async function withShopifyHoverImages(
  products: CatalogProduct[],
  locale: string
): Promise<CatalogProduct[]> {
  if (!isShopifyConfigured(locale) || products.length === 0) return products;

  try {
    const handles = [...new Set(products.map((p) => p.handle))];
    const shopifyProducts = await getProductsByHandles(handles, locale);
    const hoverByHandle = new Map<string, string>();

    for (const product of shopifyProducts) {
      const hoverUrl = product.images.nodes[1]?.url;
      if (hoverUrl) hoverByHandle.set(product.handle, hoverUrl);
    }

    if (hoverByHandle.size === 0) return products;

    return products.map((product) => {
      const hoverImage = hoverByHandle.get(product.handle);
      return hoverImage ? { ...product, hoverImage } : product;
    });
  } catch {
    return products;
  }
}
