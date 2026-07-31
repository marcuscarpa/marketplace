import type { CatalogProduct } from '@/lib/catalog/data';

/** Madison One Piece Offwhite — gallery shots (same product, same shoot). */
const MADISON_IMAGES = [
  'https://cdn.shopify.com/s/files/1/0306/9716/0839/files/STILLSINESIAKAROL-OUTUBRO24-1316.jpg?v=1765467487',
  'https://cdn.shopify.com/s/files/1/0306/9716/0839/files/STILLSINESIAKAROL-OUTUBRO24-1320.jpg?v=1765467487',
  'https://cdn.shopify.com/s/files/1/0306/9716/0839/files/STILLSINESIAKAROL-OUTUBRO24-1318.jpg?v=1765467487',
  'https://cdn.shopify.com/s/files/1/0306/9716/0839/files/STILLSINESIAKAROL-OUTUBRO24-1315.jpg?v=1765467487',
] as const;

const MADISON: Omit<CatalogProduct, 'image'> = {
  title: 'Madison One Piece Offwhite',
  category: 'One-Piece',
  price: '$262',
  handle: 'madison-one-piece',
};

/**
 * Banner shop-the-look products.
 * Last item is the primary thumbnail (visible next to "+"); others reveal to its left on expand.
 */
export const VALUES_BANNER_PRODUCTS: CatalogProduct[] = MADISON_IMAGES.map((image) => ({
  ...MADISON,
  image,
}));
