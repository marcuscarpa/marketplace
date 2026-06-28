import type { ProductTagKey } from '@/lib/product-tags';
import { LuxuryMetafields } from '@/lib/shopify/types';

export interface ProductCardProduct {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  description?: string;
  tags?: string[];
  publishedAt?: string | null;
  totalInventory?: number | null;
  images: { nodes: Array<{ url: string; altText: string | null }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants?: {
    nodes: Array<{
      id: string;
      availableForSale?: boolean;
      price: { amount: string; currencyCode?: string };
      compareAtPrice?: { amount: string; currencyCode?: string } | null;
    }>;
  };
  metafields?: Array<{ namespace: string; key: string; value: string; type: string }>;
  luxury?: LuxuryMetafields;
  badges?: ProductTagKey[];
}

export interface ProductCardProps {
  product: ProductCardProduct;
  locale: string;
}