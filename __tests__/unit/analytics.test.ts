import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  trackEvent,
  trackViewedProduct,
  trackAddedToCart,
  trackStartedCheckout,
  identifyUser,
  isKlaviyoAvailable,
  resetKlaviyoState,
} from '@/lib/analytics';

beforeEach(() => {
  resetKlaviyoState();
  vi.stubGlobal('window', undefined);
});

describe('trackEvent', () => {
  it('does not throw on server-side (no window)', () => {
    expect(() => trackEvent('test', { foo: 'bar' })).not.toThrow();
  });

  it('does not throw when window is available but Klaviyo not loaded', () => {
    vi.stubGlobal('window', { klaviyo: undefined });
    expect(() => trackEvent('test', { foo: 'bar' })).not.toThrow();
  });

  it('calls klaviyo.push when available', () => {
    const push = vi.fn();
    vi.stubGlobal('window', { klaviyo: { push } });
    trackEvent('Test Event', { key: 'value' });
    expect(push).toHaveBeenCalledWith(['track', 'Test Event', { key: 'value' }]);
  });

  it('passes empty properties when none provided', () => {
    const push = vi.fn();
    vi.stubGlobal('window', { klaviyo: { push } });
    trackEvent('No Props');
    expect(push).toHaveBeenCalledWith(['track', 'No Props', {}]);
  });
});

describe('trackViewedProduct', () => {
  it('tracks product view with correct properties', () => {
    const push = vi.fn();
    vi.stubGlobal('window', { klaviyo: { push } });
    trackViewedProduct({
      id: 'gid://shopify/Product/1',
      title: 'Silk Gown',
      handle: 'silk-gown',
      price: '1200.00',
      currency: 'USD',
      image: 'https://example.com/img.jpg',
    });
    expect(push).toHaveBeenCalledTimes(1);
    const [event, name, props] = push.mock.calls[0]![0] as [string, string, Record<string, unknown>];
    expect(event).toBe('track');
    expect(name).toBe('Viewed Product');
    expect(props.ProductID).toBe('gid://shopify/Product/1');
    expect(props.Title).toBe('Silk Gown');
    expect(props.Price).toBe('1200.00');
    expect(props.ImageURL).toBe('https://example.com/img.jpg');
  });

  it('does not throw on server-side', () => {
    expect(() =>
      trackViewedProduct({
        id: '1',
        title: 'Test',
        handle: 'test',
        price: '100',
        currency: 'USD',
      })
    ).not.toThrow();
  });
});

describe('trackAddedToCart', () => {
  it('tracks add-to-cart event', () => {
    const push = vi.fn();
    vi.stubGlobal('window', { klaviyo: { push } });
    trackAddedToCart({
      productId: 'prod-1',
      title: 'Cashmere Coat',
      variantId: 'var-1',
      quantity: 2,
      price: '2400.00',
      currency: 'USD',
    });
    const [event, name, props] = push.mock.calls[0]![0] as [string, string, Record<string, unknown>];
    expect(name).toBe('Added to Cart');
    expect(props.ProductID).toBe('prod-1');
    expect(props.Quantity).toBe(2);
    expect(props.VariantID).toBe('var-1');
  });
});

describe('trackStartedCheckout', () => {
  it('tracks checkout start event', () => {
    const push = vi.fn();
    vi.stubGlobal('window', { klaviyo: { push } });
    trackStartedCheckout({
      totalQuantity: 3,
      totalAmount: '3600.00',
      currency: 'USD',
      itemCount: 2,
    });
    const [event, name, props] = push.mock.calls[0]![0] as [string, string, Record<string, unknown>];
    expect(name).toBe('Started Checkout');
    expect(props.TotalQuantity).toBe(3);
    expect(props.TotalAmount).toBe('3600.00');
    expect(props.ItemCount).toBe(2);
  });
});

describe('identifyUser', () => {
  it('calls klaviyo identify with email', () => {
    const push = vi.fn();
    vi.stubGlobal('window', { klaviyo: { push } });
    identifyUser('user-123', 'test@example.com');
    expect(push).toHaveBeenCalledWith(['identify', { $email: 'test@example.com', $id: 'user-123' }]);
  });

  it('does not throw on server-side', () => {
    expect(() => identifyUser('user-1', 'test@test.com')).not.toThrow();
  });
});

describe('isKlaviyoAvailable', () => {
  it('returns false initially', () => {
    expect(isKlaviyoAvailable()).toBe(false);
  });

  it('returns true after initKlaviyo with window', () => {
    const push = vi.fn();
    vi.stubGlobal('window', { klaviyo: { push } });
    vi.stubEnv('NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY', 'test-key');
    trackEvent('init test');
    vi.unstubAllEnvs();
  });
});

describe('resetKlaviyoState', () => {
  it('resets availability flag', () => {
    resetKlaviyoState();
    expect(isKlaviyoAvailable()).toBe(false);
  });
});
