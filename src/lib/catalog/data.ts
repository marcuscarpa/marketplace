import { cdnAsset } from '@/lib/catalog/assets';
import { m } from '@/lib/i18n';

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
  about: '/banner%208.png',
  collectionNew: cdnAsset('images/mOaLu1cK2g12LAvtCBtK7ajjO4E.png?width=1024&height=1024'),
  collectionWomen: cdnAsset('images/bbm02GgLoJp7yqWis1qKQGi6fjU.jpg?width=1536&height=1200'),
  cycler1: '/bloco%206%2C%20imagem%20da%20esquerda%20.jpg',
  cycler2: '/bloco%206%2C%20imagem%20do%20meio%20.jpg',
  cycler3: '/bloco%206%2C%20imagem%20da%20direita.jpg',
  bestseller1: '/bloco%207%2C%20imagem%201.jpg',
  bestseller2: '/bloco%207%2C%20imagem%202.png',
  bestseller3: '/bloco%207%2C%20imagem%203.jpg',
  bestseller4: '/bloco%207%2C%20imagem%204.jpg',
  bestseller5: '/bloco%207%2C%20imagem%205.jpg',
  social1: '/bloco%209%2C%20imagem%201.png?v=20260628',
  social2: '/bloco%209%2C%20imagem%202.png?v=20260628',
  social3: '/bloco%209%2C%20imagem%203.png?v=20260628',
  social4: '/bloco%209%2C%20imagem%204.png?v=20260628',
  social5: '/bloco%209%2C%20imagem%205.png?v=20260628',
  footerLogo: cdnAsset('images/MZ8vNpExE3iwzh3LhEfoCMswUNU.png?width=3200&height=2400'),
} as const;

export const INSTAGRAM_HREF = {
  pt: 'https://www.instagram.com/sinesiakarol/',
  en: 'https://www.instagram.com/sinesiakarolusa?igsh=MXF3dmUxcGE2YzRhZw==',
} as const;

export function instagramHref(locale: string) {
  return locale === 'pt' ? INSTAGRAM_HREF.pt : INSTAGRAM_HREF.en;
}

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
  { title: 'Tan Bag', category: 'Solé', price: '€ 249', handle: 'sole', image: SITE_IMAGES.bestseller5 },
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
    title: 'Bikinis',
    category: 'Swimwear',
    price: '€ 199',
    handle: 'bikinis',
    image: SITE_IMAGES.cycler1,
  },
  {
    title: 'One Piece',
    category: 'Swimwear',
    price: '€ 199',
    handle: 'one-piece',
    image: SITE_IMAGES.cycler2,
  },
  {
    title: 'Pants + Shorts',
    category: 'Swimwear',
    price: '€ 199',
    handle: 'pants-shorts',
    image: SITE_IMAGES.cycler3,
  },
];

export function getFooterLinks(locale: string) {
  const n = m(locale).nav;
  const f = m(locale).footer;
  return {
    shop: [
      { label: n.all, href: 'collections/all' },
      { label: n.women, href: 'collections/women' },
      { label: n.new, href: 'collections/new' },
      { label: n.swimwear, href: 'collections/swimwear' },
      { label: n.readyToWear, href: 'collections/ready-to-wear' },
      { label: n.collections, href: 'collections/collections' },
      { label: n.accessories, href: 'collections/accessories' },
    ],
    company: [
      { label: n.about, href: 'about' },
      { label: n.locations, href: 'locations' },
    ],
    others: [
      { label: n.faqs, href: 'faq' },
      { label: f.ordersShipping, href: 'shipping' },
      { label: f.sizeGuide, href: 'size-chart' },
      { label: n.contact, href: 'contact' },
    ],
    legal: [
      { label: f.privacyPolicy, href: 'privacy' },
      { label: f.cookiePolicy, href: 'cookies' },
      { label: f.termsOfUse, href: 'terms' },
      { label: f.mobileTerms, href: 'mobile-terms' },
      { label: f.doNotSell, href: 'do-not-sell' },
      { label: f.returnPolicy, href: 'returns' },
    ],
  };
}

/** @deprecated use getFooterLinks(locale) */
export const FOOTER_LINKS = getFooterLinks('en');

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
