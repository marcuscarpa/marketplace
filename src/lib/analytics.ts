export interface KlaviyoEvent {
  event: string;
  properties?: Record<string, unknown>;
  customerProperties?: Record<string, unknown>;
}

let klaviyoAvailable = false;

function debugLog(message: string, meta?: Record<string, unknown>): void {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.debug(message, meta ?? '');
  }
}

function initKlaviyo(): void {
  if (typeof window === 'undefined') return;
  if (klaviyoAvailable) return;

  const publicApiKey = process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY;
  if (!publicApiKey) return;

  if (typeof (window as unknown as { klaviyo?: unknown }).klaviyo !== 'undefined') {
    klaviyoAvailable = true;
    return;
  }
}

export function isKlaviyoAvailable(): boolean {
  return klaviyoAvailable;
}

export function trackEvent(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') {
    debugLog('Klaviyo event tracked (server-side, no-op)', { event, properties });
    return;
  }

  initKlaviyo();

  const w = window as unknown as { klaviyo?: { push?: (args: unknown[]) => void } };
  if (w.klaviyo?.push) {
    w.klaviyo.push(['track', event, properties ?? {}]);
    debugLog('Klaviyo event sent', { event });
  } else {
    debugLog('Klaviyo not loaded, event skipped', { event });
  }
}

export function trackViewedProduct(product: {
  id: string;
  title: string;
  handle: string;
  price: string;
  currency: string;
  image?: string;
}): void {
  trackEvent('Viewed Product', {
    ProductID: product.id,
    Title: product.title,
    Handle: product.handle,
    Price: product.price,
    Currency: product.currency,
    ImageURL: product.image,
  });
}

export function trackAddedToCart(item: {
  productId: string;
  title: string;
  variantId: string;
  quantity: number;
  price: string;
  currency: string;
}): void {
  trackEvent('Added to Cart', {
    ProductID: item.productId,
    Title: item.title,
    VariantID: item.variantId,
    Quantity: item.quantity,
    Price: item.price,
    Currency: item.currency,
  });
}

export function trackStartedCheckout(cart: {
  totalQuantity: number;
  totalAmount: string;
  currency: string;
  itemCount: number;
}): void {
  trackEvent('Started Checkout', {
    TotalQuantity: cart.totalQuantity,
    TotalAmount: cart.totalAmount,
    Currency: cart.currency,
    ItemCount: cart.itemCount,
  });
}

export function identifyUser(userId: string, email?: string): void {
  if (typeof window === 'undefined') return;

  initKlaviyo();

  const w = window as unknown as { klaviyo?: { push?: (args: unknown[]) => void } };
  if (w.klaviyo?.push) {
    w.klaviyo.push(['identify', { $email: email, $id: userId }]);
  }
}

export function resetKlaviyoState(): void {
  klaviyoAvailable = false;
}
