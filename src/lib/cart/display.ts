export interface CartLineItem {
  id: string;
  quantity: number;
  variantId: string;
  productId: string;
  variantTitle: string;
  productTitle: string;
  handle: string;
  imageUrl: string | null;
  imageAlt: string | null;
  price: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
  quantityAvailable?: number | null;
}

export function formatCartPrice(amount: string, currency: string, locale: string) {
  return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}
