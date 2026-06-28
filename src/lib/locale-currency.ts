export function currencyForLocale(locale: string): 'BRL' | 'USD' {
  return locale === 'pt' ? 'BRL' : 'USD';
}

/** ponytail: locale maps 1:1 to Shopify store — pt → BR/BRL, en → US/USD */
export function isUsdStore(locale: string): boolean {
  return currencyForLocale(locale) === 'USD';
}

export function formatPriceForLocale(amount: number | string, locale: string): string {
  return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency: currencyForLocale(locale),
  }).format(Number(amount));
}

/** Parse catalog strings like "€ 199", "$127", or Shopify "127.00". */
export function parseCatalogPriceAmount(price: string): number {
  const normalized = price.replace(/[^\d.,]/g, '').replace(/,/g, '');
  return parseFloat(normalized) || 0;
}

/** Storefront card price — locale currency, not hardcoded €. */
export function formatCatalogPrice(price: string, locale: string): string {
  const amount = parseCatalogPriceAmount(price);
  return amount ? formatPriceForLocale(amount, locale) : price;
}
