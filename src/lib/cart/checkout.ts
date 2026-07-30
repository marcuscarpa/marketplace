/** True when a regional Shopify store env is still a dev/test placeholder. */
export function isPlaceholderShopifyDomain(domain: string): boolean {
  return !domain || domain.includes('test-') || domain.includes('dev-placeholder');
}

/** Prefer Shopify checkoutUrl; fall back to server redirect that reads the cart cookie. */
export function resolveCheckoutHref(
  checkoutUrl: string | null | undefined,
  locale: string,
): string {
  if (checkoutUrl) return checkoutUrl;
  return `/${locale}/api/cart/checkout`;
}

/** External Shopify checkout must use hard navigation — React unmount can cancel <a> clicks. */
export function navigateToCheckout(href: string): void {
  window.location.assign(href);
}

export function canStartCheckout(options: {
  isMockCart: boolean;
  checkoutDisabled?: boolean;
  hasLines: boolean;
}): boolean {
  if (options.checkoutDisabled || options.isMockCart || !options.hasLines) return false;
  return true;
}
