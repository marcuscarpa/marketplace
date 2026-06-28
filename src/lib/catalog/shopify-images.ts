import { formatPrice, type CatalogProduct } from '@/lib/catalog/data';
import { isShopifyConfigured } from '@/lib/shopify/client';
import { getProductsByHandles } from '@/lib/shopify/loader';
import type { ShopifyProduct } from '@/lib/shopify/types';

function mergeShopifyProduct(catalog: CatalogProduct, shopify: ShopifyProduct): CatalogProduct {
  const images = shopify.images.nodes;
  const amount = shopify.priceRange.minVariantPrice.amount;

  return {
    ...catalog,
    title: shopify.title || catalog.title,
    category: shopify.vendor || catalog.category,
    price: amount ? formatPrice(amount) : catalog.price,
    image: images[0]?.url ?? catalog.image,
    hoverImage: images[1]?.url ?? catalog.hoverImage,
  };
}

/** Enrich static catalog cards with live Shopify images, copy, and pricing when configured. */
export async function withShopifyHoverImages(
  products: CatalogProduct[],
  locale: string
): Promise<CatalogProduct[]> {
  if (!isShopifyConfigured(locale) || products.length === 0) return products;

  try {
    const handles = [...new Set(products.map((p) => p.handle))];
    const shopifyProducts = await getProductsByHandles(handles, locale);
    const byHandle = new Map(shopifyProducts.map((product) => [product.handle, product]));

    if (byHandle.size === 0) return products;

    return products.map((product) => {
      const shopify = byHandle.get(product.handle);
      return shopify ? mergeShopifyProduct(product, shopify) : product;
    });
  } catch {
    return products;
  }
}

// ponytail: dev-only sanity check; upgrade path: vitest if merge rules grow
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  const merged = mergeShopifyProduct(
    {
      title: 'Fallback',
      category: 'Catalog',
      price: '€ 100',
      handle: 'demo',
      image: '/fallback.jpg',
    },
    {
      id: 'gid://shopify/Product/1',
      title: 'Shopify Title',
      description: '',
      handle: 'demo',
      vendor: 'Vendor',
      images: {
        nodes: [
          { url: 'https://cdn.shopify.com/a.jpg', altText: null },
          { url: 'https://cdn.shopify.com/b.jpg', altText: null },
        ],
      },
      options: [],
      priceRange: { minVariantPrice: { amount: '329.00', currencyCode: 'EUR' } },
      variants: { nodes: [] },
      metafields: [],
    }
  );
  if (
    merged.title !== 'Shopify Title' ||
    merged.image !== 'https://cdn.shopify.com/a.jpg' ||
    merged.hoverImage !== 'https://cdn.shopify.com/b.jpg' ||
    merged.price !== '€ 329'
  ) {
    console.error('[shopify-images] mergeShopifyProduct self-check failed');
  }
}
