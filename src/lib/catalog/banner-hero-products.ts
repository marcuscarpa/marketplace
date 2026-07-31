import { SITE_IMAGES, type CatalogProduct } from '@/lib/catalog/data';

/**
 * Banner shop-the-look products.
 * Last item is the primary thumbnail (visible next to "+"); others reveal to its left on expand.
 */
export const VALUES_BANNER_PRODUCTS: CatalogProduct[] = [
  {
    title: 'Adeline One Piece',
    category: 'One-Piece',
    price: '$247',
    handle: 'adeline-one-piece',
    image: SITE_IMAGES.bestseller3,
  },
  {
    title: 'Madison One Piece Offwhite',
    category: 'One-Piece',
    price: '$262',
    handle: 'madison-one-piece',
    image: SITE_IMAGES.bestseller4,
  },
];
