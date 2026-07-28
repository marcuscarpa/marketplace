import type { CartLineItem } from '@/lib/cart/display';
import { maxVariantQuantity } from '@/lib/shopify/variants';

export function lineTotal(line: CartLineItem): number {
  return Number(line.price.amount) * line.quantity;
}

export function lineMaxQuantity(line: CartLineItem): number {
  return maxVariantQuantity({
    availableForSale: true,
    quantityAvailable: line.quantityAvailable,
  });
}

export function totalQuantityFromLines(lines: CartLineItem[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function subtotalFromLines(lines: CartLineItem[]): { amount: string; currencyCode: string } | null {
  if (!lines.length) return null;
  const currencyCode = lines[0]!.price.currencyCode;
  const amount = lines.reduce((sum, line) => sum + lineTotal(line), 0).toFixed(2);
  return { amount, currencyCode };
}

export function updateLineQuantity(lines: CartLineItem[], lineId: string, quantity: number): CartLineItem[] {
  return lines.map((line) => (line.id === lineId ? { ...line, quantity } : line));
}

export function removeLine(lines: CartLineItem[], lineId: string): CartLineItem[] {
  return lines.filter((line) => line.id !== lineId);
}
