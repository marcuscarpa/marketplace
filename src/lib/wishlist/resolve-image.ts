import { getCatalogProductByHandle } from '@/lib/catalog/catalog';

/** Client-safe fallback when cart/API omits product thumbnails. */
export function resolveWishlistImage(handle: string, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl;
  return getCatalogProductByHandle(handle)?.image ?? '';
}
