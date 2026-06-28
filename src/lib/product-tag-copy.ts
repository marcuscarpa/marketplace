import type { ProductTagKey } from '@/lib/product-tags';

const EN: Record<ProductTagKey, string> = {
  newArrival: 'New arrival',
  soldOut: 'Sold out',
  sale: 'Sale',
  bestseller: 'Bestseller',
};

const PT: Record<ProductTagKey, string> = {
  newArrival: 'Novidade',
  soldOut: 'Esgotado',
  sale: 'Promoção',
  bestseller: 'Mais vendidos',
};

export function getProductTagLabel(locale: string, key: ProductTagKey): string {
  return locale === 'pt' ? PT[key] : EN[key];
}
