import { describe, expect, it } from 'vitest';

import { canStartCheckout, isPlaceholderShopifyDomain, resolveCheckoutHref } from '@/lib/cart/checkout';

describe('checkout helpers', () => {
  it('detects placeholder Shopify domains', () => {
    expect(isPlaceholderShopifyDomain('test-br.myshopify.com')).toBe(true);
    expect(isPlaceholderShopifyDomain('dev-placeholder.myshopify.com')).toBe(true);
    expect(isPlaceholderShopifyDomain('sinesiakarolnew.myshopify.com')).toBe(false);
  });

  it('prefers Shopify checkoutUrl over API redirect', () => {
    expect(resolveCheckoutHref('https://checkout.shopify.com/c/abc', 'en')).toBe(
      'https://checkout.shopify.com/c/abc',
    );
    expect(resolveCheckoutHref(null, 'pt')).toBe('/pt/api/cart/checkout');
  });

  it('blocks checkout for mock carts and kill switch', () => {
    expect(canStartCheckout({ isMockCart: true, hasLines: true })).toBe(false);
    expect(canStartCheckout({ isMockCart: false, checkoutDisabled: true, hasLines: true })).toBe(false);
    expect(canStartCheckout({ isMockCart: false, hasLines: false })).toBe(false);
    expect(canStartCheckout({ isMockCart: false, hasLines: true })).toBe(true);
  });
});
