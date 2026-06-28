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
