import type { CartLineItem } from '@/lib/cart/display';

export function lineTotal(line: CartLineItem): number {
  return Number(line.price.amount) * line.quantity;
}

export function lineMaxQuantity(line: CartLineItem): number {
  const stock = line.quantityAvailable;
  if (stock === null || stock === undefined) {
    return 99;
  }
  // Cart line API often returns 0 even when the variant is sellable; don't block + if already in bag.
  if (stock === 0 && line.quantity > 0) {
    return 99;
  }
  return Math.min(Math.max(stock, line.quantity), 99);
}

/** User-facing hint when quantity is capped by inventory. */
export function lineStockHint(line: CartLineItem, locale: string): string | null {
  const stock = line.quantityAvailable;
  if (stock === null || stock === undefined) return null;
  if (stock === 0 && line.quantity > 0) return null;

  const max = lineMaxQuantity(line);
  const isPt = locale === 'pt';

  if (line.quantity >= max && max < 99) {
    if (max === 1) {
      return isPt ? 'Última unidade — não é possível aumentar' : 'Last unit — cannot increase quantity';
    }
    return isPt ? `Máximo ${max} disponíveis neste tamanho` : `Maximum ${max} available in this size`;
  }

  if (stock > 0 && stock <= 3) {
    return isPt ? `Apenas ${stock} em estoque` : `Only ${stock} in stock`;
  }

  return null;
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
