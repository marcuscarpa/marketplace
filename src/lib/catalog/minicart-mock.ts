import { BESTSELLERS, POPULAR_PRODUCTS, type CatalogProduct } from '@/lib/catalog/data';
import type { CartLineItem } from '@/lib/cart/display';
import { currencyForLocale } from '@/lib/locale-currency';

export interface MinicartRecommendation {
  handle: string;
  title: string;
  price: string;
  image: string;
}

/** ponytail: sentinel id — cart drawer treats remove as client-only */
export const MOCK_CART_ID = 'mock-cart';

/** ponytail: local catalog handles — Zimmermann URLs 404 on /products/ */
const picks = [...POPULAR_PRODUCTS.slice(0, 1), ...BESTSELLERS.slice(0, 4)].filter(Boolean) as Array<{ handle: string; title: string; price: string; image: string }>;

export const MINICART_RECOMMENDATIONS: MinicartRecommendation[] = picks.map((p) => ({
  handle: p.handle,
  title: p.title,
  price: p.price,
  image: p.image,
}));

function parsePriceAmount(price: string): string {
  const amount = price.replace(/[^\d.]/g, '');
  return amount || '0';
}

function mockLine(
  product: CatalogProduct,
  lineId: string,
  size: string,
  quantity: number,
  locale: string
): CartLineItem {
  const currencyCode = currencyForLocale(locale);
  return {
    id: lineId,
    quantity,
    variantId: `mock-variant-${product.handle}`,
    productId: `mock-product-${product.handle}`,
    variantTitle: size,
    productTitle: product.title.toUpperCase(),
    handle: product.handle,
    imageUrl: product.image,
    imageAlt: product.title,
    price: { amount: parsePriceAmount(product.price), currencyCode },
    selectedOptions: [{ name: 'Size', value: size }],
    quantityAvailable: 10,
  };
}

/** Demo bag while Shopify credentials are placeholders / missing */
export function getMockCart(locale: string) {
  const [first, second] = POPULAR_PRODUCTS;
  if (!first || !second) {
    return {
      id: MOCK_CART_ID,
      totalQuantity: 0,
      checkoutUrl: null as string | null,
      cost: null,
      lines: [] as CartLineItem[],
    };
  }

  const lines = [
    mockLine(first, 'mock-line-1', 'M', 1, locale),
    mockLine(second, 'mock-line-2', 'S', 1, locale),
  ];
  const currencyCode = currencyForLocale(locale);
  const subtotal = lines.reduce((sum, line) => sum + Number(line.price.amount) * line.quantity, 0);

  return {
    id: MOCK_CART_ID,
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    checkoutUrl: null as string | null,
    cost: {
      subtotalAmount: { amount: subtotal.toFixed(2), currencyCode },
      totalAmount: { amount: subtotal.toFixed(2), currencyCode },
      totalTaxAmount: null,
    },
    lines,
  };
}

export function isMockCartId(id: string | null | undefined): boolean {
  return id === MOCK_CART_ID;
}
