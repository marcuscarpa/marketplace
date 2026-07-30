import { getCatalogProductByHandle } from '@/lib/catalog/catalog';
import { SEARCH_MODAL_PRODUCTS, type CatalogProduct } from '@/lib/catalog/data';

export interface WishlistStoredItem {
  id: string;
  handle: string;
  title: string;
  price: string;
  image: string;
  vendor?: string;
  hoverImage?: string;
  variantId?: string;
  productId?: string;
  variantLabel?: string;
  priceAmount?: string;
  currencyCode?: string;
  availableForSale?: boolean;
  badge?: 'soldOut' | 'lowStock' | null;
}

const LEGACY_HANDLES = new Set([
  'denim-cargo-jean',
  'luna-denim-utility-bomber',
  'indra-cropped-flare-jean',
  'denim-flare-jean',
  'luna-utility-flare-jean',
  'indra-denim-relaxed-flare-jean',
  'alight-wedge-100',
]);

export function catalogToWishlistItem(product: CatalogProduct): WishlistStoredItem {
  return {
    id: product.handle,
    handle: product.handle,
    title: product.title,
    price: product.price,
    image: product.image,
  };
}

/** Demo / default favorites — same products as search modal. */
export const WISHLIST_SEED_ITEMS: WishlistStoredItem[] =
  SEARCH_MODAL_PRODUCTS.map(catalogToWishlistItem);

function isLegacyItem(item: WishlistStoredItem): boolean {
  return (
    LEGACY_HANDLES.has(item.handle) ||
    LEGACY_HANDLES.has(item.id) ||
    item.image.includes('zimmermann.com')
  );
}

function refreshFromCatalog(item: WishlistStoredItem): WishlistStoredItem | null {
  const product = getCatalogProductByHandle(item.handle);
  return product ? catalogToWishlistItem(product) : null;
}

/** Drop placeholder favorites; refresh titles/images from local catalog. */
export function normalizeWishlistItems(stored: WishlistStoredItem[]): WishlistStoredItem[] {
  if (stored.some(isLegacyItem)) return [];

  const refreshed = stored
    .map((item) => {
      const fromCatalog = refreshFromCatalog(item);
      if (fromCatalog) return fromCatalog;
      if (isLegacyItem(item)) return null;
      if (!item.image) {
        const catalog = getCatalogProductByHandle(item.handle);
        if (catalog?.image) return { ...item, image: catalog.image };
      }
      return item;
    })
    .filter(Boolean) as WishlistStoredItem[];

  const seen = new Set<string>();
  return refreshed.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

// ponytail: dev-only sanity check
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  const legacy = normalizeWishlistItems([
    {
      id: 'denim-cargo-jean',
      handle: 'denim-cargo-jean',
      title: 'Denim Cargo Jean',
      price: '$625',
      image: 'https://www.zimmermann.com/x.jpg',
    },
  ]);
  if (legacy.length !== 0) {
    console.error('[wishlist-seed] normalizeWishlistItems should drop legacy items');
  }
}
