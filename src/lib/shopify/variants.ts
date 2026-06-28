import type { ShopifyProductOption, ShopifyProductVariant } from './types';

export function isColorOption(name: string): boolean {
  return /color|cor|colour/i.test(name);
}

export function isSizeOption(name: string): boolean {
  return /size|tamanho/i.test(name);
}

/** Color before size, then everything else. */
export function sortProductOptions(options: ShopifyProductOption[]): ShopifyProductOption[] {
  return [...options].sort((a, b) => {
    const aColor = isColorOption(a.name);
    const bColor = isColorOption(b.name);
    if (aColor !== bColor) return aColor ? -1 : 1;

    const aSize = isSizeOption(a.name);
    const bSize = isSizeOption(b.name);
    if (aSize !== bSize) return aSize ? -1 : 1;

    return 0;
  });
}

export function defaultSelectedOptions(
  options: ShopifyProductOption[]
): Record<string, string> {
  return Object.fromEntries(options.map((o) => [o.name, o.values[0] ?? '']));
}

export function findMatchingVariant(
  variants: ShopifyProductVariant[],
  selected: Record<string, string>
): ShopifyProductVariant | undefined {
  return variants.find((variant) =>
    (variant.selectedOptions ?? []).every((opt) => selected[opt.name] === opt.value)
  );
}

const CART_QTY_MAX = 99;

/** Max units addable for a variant, capped by Shopify inventory when tracked. */
export function maxVariantQuantity(
  variant: Pick<ShopifyProductVariant, 'availableForSale' | 'quantityAvailable'>
): number {
  if (variant.availableForSale === false) return 0;
  const stock = variant.quantityAvailable;
  if (stock !== null && stock !== undefined && stock >= 0) return Math.min(stock, CART_QTY_MAX);
  return CART_QTY_MAX;
}

const COLOR_HEX: Record<string, string> = {
  pecan: '#9B6B4F',
  milk: '#F5F0E8',
  black: '#1a1a1a',
  natural: '#d4c4a8',
  white: '#f5f5f5',
  navy: '#1e3a5f',
  beige: '#d4c4a8',
  gold: '#c9a227',
  red: '#8b2635',
  'harbour blue': '#2c4a6e',
  skylark: '#7a8fa3',
};

export function colorSwatchHex(name: string): string {
  return COLOR_HEX[name.toLowerCase()] ?? '#d4d4d4';
}
