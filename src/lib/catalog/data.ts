import { cdnAsset } from '@/lib/catalog/assets';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import { m } from '@/lib/i18n';

export const SITE_IMAGES = {
  hero: '/banner-hero.webp',
  popular1: '/imagem%20bloco%202%20still%20(1).webp',
  popular2: '/Imagem%20Bloco%202%20still.webp',
  popularSide: '/imagem-bloco-2.webp',
  popularSideTablet: '/Bloco3_ipad.webp',
  values: '/bloco%203.1.webp',
  valuesVideo: '/banner%20alta%20costura%20.mp4',
  arrival1: '/Bloco4%20imagem%201.webp',
  arrival2: '/Bloco4%20imagem%202.webp',
  arrival3: '/Bloco4%20imagem%203.webp',
  arrival4: '/Bloco4%20imagem%204.webp',
  about: '/banner%208.webp',
  collectionNew: cdnAsset('images/mOaLu1cK2g12LAvtCBtK7ajjO4E.png?width=1024&height=1024'),
  collectionWomen: '/bloco%208%2C%20imagem%20da%20esquerda.webp',
  collectionWomenMobile: '/imagem%20da%20esquerda%20maior.webp',
  collectionWomenProduct: '/bloco%208%2C%20imagem%20da%20direita.webp',
  cycler1: '/bloco%206%2C%20imagem%20da%20esquerda%20.webp',
  cycler2: '/bloco%206%2C%20imagem%20do%20meio%20.webp',
  cycler3: '/bloco%206%2C%20imagem%20da%20direita.webp',
  bestseller1: '/bloco%207%2C%20imagem%201.webp',
  bestseller2: '/bloco%207%2C%20imagem%202.webp',
  bestseller3: '/bloco%207%2C%20imagem%203.webp',
  bestseller4: '/bloco%207%2C%20imagem%204.webp',
  bestseller5: '/bloco%207%2C%20imagem%205.webp',
  social1: '/bloco%209%2C%20imagem%201.webp?v=20260628',
  social2: '/bloco%209%2C%20imagem%202.webp?v=20260628',
  social3: '/bloco%209%2C%20imagem%203.webp?v=20260628',
  social4: '/bloco%209%2C%20imagem%204.webp?v=20260628',
  social5: '/bloco%209%2C%20imagem%205.webp?v=20260628',
  footerLogo: cdnAsset('images/MZ8vNpExE3iwzh3LhEfoCMswUNU.png?width=3200&height=2400'),
  footerBackground: '/footer-image.jpeg',
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

export const POPULAR_PRODUCTS: CatalogProduct[] = [
  { title: 'Cora Bikini Top', category: 'Bikini', price: '$127', handle: 'cora-bikini-top', image: SITE_IMAGES.popular1 },
  {
    title: 'Michelle Pareo - Beach Pattern',
    category: 'Skirts',
    price: '$380',
    handle: 'michelle-pareo-poa-pistachio-copy-1',
    image: SITE_IMAGES.popular2,
  },
];

export const NEW_ARRIVALS: CatalogProduct[] = [
  {
    title: 'Neia Bikini Top Pistachio',
    category: 'Bikini',
    price: '$140',
    handle: 'neia-bikini-top-pistachio',
    image: SITE_IMAGES.arrival1,
  },
  {
    title: 'Neia Bikini Bottom Pistachio',
    category: 'Bikini',
    price: '$140',
    handle: 'neia-bikini-bottom-pistachio',
    image: SITE_IMAGES.arrival2,
  },
  {
    title: 'Ava Bikini Top Astral',
    category: 'Bikini',
    price: '$117',
    handle: 'ava-bikini-top-astral',
    image: SITE_IMAGES.arrival3,
  },
  {
    title: 'Ava Bikini Bottom Astral',
    category: 'Bikini',
    price: '$107',
    handle: 'ava-bikini-bottom-astral',
    image: SITE_IMAGES.arrival4,
  },
];

/** Default grid for search modal — same products as home (popular + new arrivals). */
export const SEARCH_MODAL_PRODUCTS: CatalogProduct[] = [
  ...POPULAR_PRODUCTS,
  ...NEW_ARRIVALS,
].slice(0, 6);

/** Featured product beside the women collection editorial on the home page. */
export const SPOTLIGHT_PRODUCT: CatalogProduct = {
  title: 'Lolo Skirt - Crochet',
  category: 'Skirts',
  price: '$165.00',
  handle: 'lolo-skirt-crochet',
  image: SITE_IMAGES.collectionWomenProduct,
};

export const BESTSELLERS: CatalogProduct[] = [
  {
    title: 'Josephine Dress',
    category: 'Ready-to-Wear',
    price: '$670',
    handle: 'josephine-dress',
    image: SITE_IMAGES.bestseller1,
  },
  {
    title: 'Larissa Romper Off White',
    category: 'Romper',
    price: '$460',
    handle: 'macaquinho-larissa-off-white',
    image: SITE_IMAGES.bestseller2,
  },
  {
    title: 'Adeline One Piece',
    category: 'One-Piece',
    price: '$247',
    handle: 'adeline-one-piece',
    image: SITE_IMAGES.bestseller3,
  },
  {
    title: 'Madison One Piece Black',
    category: 'One-Piece',
    price: '$262',
    handle: 'madison-one-piece-offwhite-copy',
    image: SITE_IMAGES.bestseller4,
  },
  {
    title: 'Emma Linen Pants',
    category: 'Pants',
    price: '$440',
    handle: 'emma-linen-pants',
    image: SITE_IMAGES.bestseller5,
  },
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
      { label: n.all, href: collectionPath(SHOPIFY_COLLECTION.shopAll) },
      { label: n.new, href: collectionPath(SHOPIFY_COLLECTION.newArrivals) },
      { label: n.swimwear, href: collectionPath(SHOPIFY_COLLECTION.swimwear) },
      { label: n.readyToWear, href: collectionPath(SHOPIFY_COLLECTION.readyToWear) },
      { label: n.collections, href: collectionPath(SHOPIFY_COLLECTION.featured) },
      { label: n.accessories, href: collectionPath(SHOPIFY_COLLECTION.accessories) },
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
