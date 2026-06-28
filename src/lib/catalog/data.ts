import { cdnAsset } from '@/lib/catalog/assets';

export const SITE_IMAGES = {
  hero: '/banner-hero.png',
  popular1: '/imagem%20bloco%202%20still%20(1).jpg',
  popular2: '/Imagem%20Bloco%202%20still.jpg',
  popularSide: '/imagem-bloco-2.png',
  popularSideMobile: '/Boco2-mobile.png',
  values: '/bloco%203.1.png',
  arrival1: '/Bloco4%20imagem%201.webp',
  arrival2: '/Bloco4%20imagem%202.png',
  arrival3: '/Bloco4%20imagem%203.png',
  arrival4: '/Bloco4%20imagem%204.webp',
  about: cdnAsset('images/JLbSOzdi8ek3X2YzUzUCXMjFDlU.jpg?width=1536&height=1024'),
  collectionNew: cdnAsset('images/mOaLu1cK2g12LAvtCBtK7ajjO4E.png?width=1024&height=1024'),
  collectionWomen: cdnAsset('images/bbm02GgLoJp7yqWis1qKQGi6fjU.jpg?width=1536&height=1200'),
  cycler1: '/bloco%206%2C%20imagem%20da%20esquerda.jpg',
  cycler2: '/bloco%206%2C%20imagem%20do%20meio.png',
  cycler3: '/bloco%206%2C%20imagem%20da%20direita.png',
  bestseller1: cdnAsset('images/xTaf4V9yVpxl8rSOPggHjX1Litk.png?width=1024&height=1024'),
  bestseller2: cdnAsset('images/DRslE52UHyQqe8Mi45WInMrA.png?width=1024&height=1024'),
  bestseller3: cdnAsset('images/GFpIu9B8u4cOwHqWyNdHYOg3Wnk.png?width=1024&height=1024'),
  bestseller4: cdnAsset('images/lkDH4HvpyZRW7lUqiOpPX8jIVOk.png?width=1024&height=1024'),
  social1: cdnAsset('images/kMTeJujLtRr9m4cZMtpfIRvsNY.png?width=1024&height=1024'),
  social2: cdnAsset('images/10AYOLDB5Pm1gmWZMnRjhBNT8o.png?width=1024&height=1024'),
  social3: cdnAsset('images/QUVr0uhAgeEP4EaZXV1HDyLfi1o.png?width=1024&height=1024'),
  footerLogo: cdnAsset('images/MZ8vNpExE3iwzh3LhEfoCMswUNU.png?width=3200&height=2400'),
} as const;

export interface CatalogProduct {
  title: string;
  category: string;
  price: string;
  handle: string;
  image: string;
  hoverImage?: string;
  compareAtPrice?: string;
  soldOut?: boolean;
}

/** catalog price format: euro symbol + space + amount (e.g. "€ 199"). */
export function formatPrice(price: string): string {
  const amount = price.replace(/[^\d]/g, '');
  return amount ? `€ ${amount}` : price;
}

const ZIM_PRODUCT_IMG =
  '?quality=100&bg-color=255,255,255&fit=bounds&height=755&width=581&canvas=581:755';

/** Curated grid for search modal (Zimmermann-style denim reference). */
export const SEARCH_MODAL_PRODUCTS: CatalogProduct[] = [
  {
    title: 'Denim Cargo Jean',
    category: 'Denim',
    price: '$625',
    compareAtPrice: '$895',
    handle: 'denim-cargo-jean',
    image:
      'https://www.zimmermann.com/media/catalog/product/1/_/1.7482ps26r.hbbl.harbour-blue.jpg' + ZIM_PRODUCT_IMG,
  },
  {
    title: 'Luna Denim Utility Bomber',
    category: 'Denim',
    price: '$1,425',
    handle: 'luna-denim-utility-bomber',
    image:
      'https://www.zimmermann.com/media/catalog/product/1/_/1.7722js261.hbbl.harbour-blue.jpg' + ZIM_PRODUCT_IMG,
  },
  {
    title: 'Indra Cropped Flare Jean',
    category: 'Denim',
    price: '$650',
    handle: 'indra-cropped-flare-jean',
    image:
      'https://www.zimmermann.com/media/catalog/product/1/_/1.2726pss252.skylk.skylark_1.jpg' + ZIM_PRODUCT_IMG,
  },
  {
    title: 'Denim Flare Jean',
    category: 'Denim',
    price: '$455',
    compareAtPrice: '$650',
    handle: 'denim-flare-jean',
    image:
      'https://www.zimmermann.com/media/catalog/product/1/_/1.8712ps26r.hbbl.harbour-blue.jpg' + ZIM_PRODUCT_IMG,
  },
  {
    title: 'Luna Utility Flare Jean',
    category: 'Denim',
    price: '$995',
    handle: 'luna-utility-flare-jean',
    image:
      'https://www.zimmermann.com/media/catalog/product/1/_/1.7724ps261.hbbl.harbour-blue.jpg' + ZIM_PRODUCT_IMG,
  },
  {
    title: 'Indra Denim Relaxed Flare Jean',
    category: 'Denim',
    price: '$675',
    handle: 'indra-denim-relaxed-flare-jean',
    image:
      'https://www.zimmermann.com/media/catalog/product/1/_/1.9156pss262.skylk.skylark.jpg' + ZIM_PRODUCT_IMG,
  },
];

export const POPULAR_PRODUCTS: CatalogProduct[] = [
  { title: 'Téré Drop', category: 'Accessories', price: '€ 199', handle: 'tere-drop', image: SITE_IMAGES.popular1 },
  { title: 'Pendant', category: 'Accessories', price: '€ 199', handle: 'pendant', image: SITE_IMAGES.popular2 },
];

export const NEW_ARRIVALS: CatalogProduct[] = [
  {
    title: 'Téré',
    category: 'Accessories',
    price: '€ 199',
    handle: 'tere',
    image: SITE_IMAGES.arrival1,
  },
  {
    title: 'Cream Bag',
    category: 'Bags',
    price: '€ 299',
    handle: 'mesla',
    image: SITE_IMAGES.arrival2,
  },
  {
    title: 'Uspa',
    category: 'Bracelets',
    price: '€ 299',
    handle: 'uspa',
    image: SITE_IMAGES.arrival3,
  },
  {
    title: 'Brown Belt',
    category: 'Accessories',
    price: '€ 99',
    handle: 'yemas',
    image: SITE_IMAGES.arrival4,
  },
];

export const BESTSELLERS: CatalogProduct[] = [
  { title: 'Brown Bag', category: 'Civelle', price: '€ 329', handle: 'civelle', image: SITE_IMAGES.bestseller1 },
  { title: 'Brown Bag', category: 'Sauné', price: '€ 279', handle: 'saune', image: SITE_IMAGES.bestseller2 },
  { title: 'Black Bag', category: 'Lunet', price: '€ 299', handle: 'lunet', image: SITE_IMAGES.bestseller3 },
  { title: 'White Bag', category: 'Éloé', price: '€ 199', handle: 'eloe', image: SITE_IMAGES.bestseller4 },
];

export const CATEGORIES = [
  {
    title: 'Bags',
    description: 'Sculpted shapes. Elevated function. Made for everyday and beyond.',
    handle: 'bags',
  },
  {
    title: 'Bracelets',
    description: 'Refined details. Minimal forms. Pieces that speak quiet luxury.',
    handle: 'bracelets',
  },
  {
    title: 'Accessories',
    description: 'Versatile essentials. Thoughtful touches. Designed to complete your look.',
    handle: 'accessories',
  },
] as const;

export const CYCLER_PRODUCTS: CatalogProduct[] = [
  {
    title: 'AnaVitoria Dress Poá Pistachio',
    category: 'Swimwear',
    price: '€ 199',
    handle: 'anavitoria-dress-poa-pistachio',
    image: SITE_IMAGES.cycler1,
  },
  {
    title: 'Thais Poa Pistachio Bikini Bottom',
    category: 'Swimwear',
    price: '€ 199',
    handle: 'thais-poa-pistachio-bikini-bottom',
    image: SITE_IMAGES.cycler2,
  },
  {
    title: 'Michelle Pareo - Poa Pistachio',
    category: 'Swimwear',
    price: '€ 199',
    handle: 'michelle-pareo-poa-pistachio',
    image: SITE_IMAGES.cycler3,
  },
];

export const FOOTER_LINKS = {
  shop: [
    { label: 'All', href: 'collections/all' },
    { label: 'Women', href: 'collections/women' },
    { label: 'New', href: 'collections/new' },
    { label: 'Swimwear', href: 'collections/swimwear' },
    { label: 'Ready-to-Wear', href: 'collections/ready-to-wear' },
    { label: 'Collections', href: 'collections/collections' },
    { label: 'Accessories', href: 'collections/accessories' },
  ],
  company: [
    { label: 'About', href: 'about' },
    { label: 'Locations', href: 'locations' },
  ],
  others: [
    { label: "FAQ's", href: 'faq' },
    { label: 'Orders & Shipping', href: 'shipping' },
    { label: 'Size Guide', href: 'size-chart' },
    { label: 'Contact', href: 'contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: 'privacy' },
    { label: 'Cookie Policy', href: 'cookies' },
    { label: 'Terms of use', href: 'terms' },
    { label: 'Mobile Terms of Service', href: 'mobile-terms' },
    { label: 'Do not sell or share my info', href: 'do-not-sell' },
    { label: 'Return Policy', href: 'returns' },
  ],
} as const;

export const MENU_LINKS = [
  { label: 'Shop All', href: 'collections/all' },
  { label: 'Women', href: 'collections/women' },
  { label: 'New', href: 'collections/new' },
  { label: 'Bags', href: 'collections/bags' },
  { label: 'Bracelets', href: 'collections/bracelets' },
  { label: 'Accessories', href: 'collections/accessories' },
  { label: 'About', href: 'about' },
  { label: 'Values', href: 'values' },
  { label: 'Newsroom', href: 'newsroom' },
  { label: 'Contact', href: 'contact' },
] as const;
