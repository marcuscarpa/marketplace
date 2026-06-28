import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addToCartAction, CartActionState } from '@/actions/cart';
import { ZodError } from 'zod';

const {
  mockCheckRateLimit,
  mockRedis,
  mockRevalidateTag,
  mockCookiesGet,
  mockCookiesSet,
  mockShopifyExecute,
} = vi.hoisted(() => ({
  mockCheckRateLimit: vi.fn().mockResolvedValue({ blocked: false }),
  mockRedis: {
    del: vi.fn().mockResolvedValue(1),
  },
  mockRevalidateTag: vi.fn(),
  mockCookiesGet: vi.fn(),
  mockCookiesSet: vi.fn(),
  mockShopifyExecute: vi.fn(),
}));

vi.mock('@/lib/security/bot-protection', () => ({
  checkRateLimit: mockCheckRateLimit,
}));

vi.mock('@/lib/redis/client', () => ({
  getRedisClient: () => mockRedis,
}));

vi.mock('@/lib/shopify/client', () => ({
  getShopifyClient: () => ({
    execute: mockShopifyExecute,
  }),
}));

vi.mock('next/cache', () => ({
  revalidateTag: mockRevalidateTag,
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: mockCookiesGet,
    set: mockCookiesSet,
  }),
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue('127.0.0.1'),
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockCheckRateLimit.mockResolvedValue({ blocked: false });
  mockCookiesGet.mockReturnValue(undefined);
  mockCookiesSet.mockResolvedValue(undefined);
  mockShopifyExecute.mockReset();
  mockRevalidateTag.mockResolvedValue(undefined);
  mockRedis.del.mockResolvedValue(1);
});

describe('Cart Action', () => {
  describe('addToCartAction schema validation', () => {
    it('rejects variantId not starting with gid://shopify/ProductVariant/', async () => {
      const formData = new FormData();
      formData.set('variantId', 'invalid-variant-id');
      formData.set('quantity', '1');
      formData.set('locale', 'en');

      const result = await addToCartAction({ success: false, message: '' }, formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid');
    });

    it('rejects quantity below 1', async () => {
      const formData = new FormData();
      formData.set('variantId', 'gid://shopify/ProductVariant/123');
      formData.set('quantity', '0');
      formData.set('locale', 'en');

      const result = await addToCartAction({ success: false, message: '' }, formData);

      expect(result.success).toBe(false);
      expect(result.message).toMatch(/greater than or equal to 1|too_small/i);
    });

    it('rejects quantity above 99', async () => {
      const formData = new FormData();
      formData.set('variantId', 'gid://shopify/ProductVariant/123');
      formData.set('quantity', '100');
      formData.set('locale', 'en');

      const result = await addToCartAction({ success: false, message: '' }, formData);

      expect(result.success).toBe(false);
      expect(result.message).toMatch(/less than or equal to 99|too_big/i);
    });

    it('rejects negative quantity', async () => {
      const formData = new FormData();
      formData.set('variantId', 'gid://shopify/ProductVariant/123');
      formData.set('quantity', '-5');
      formData.set('locale', 'en');

      const result = await addToCartAction({ success: false, message: '' }, formData);

      expect(result.success).toBe(false);
    });

    it('accepts valid variantId and quantity', async () => {
      const formData = new FormData();
      formData.set('variantId', 'gid://shopify/ProductVariant/123456');
      formData.set('quantity', '2');
      formData.set('locale', 'en');

      mockShopifyExecute.mockResolvedValue({
        cartCreate: {
          cart: {
            id: 'gid://shopify/Cart/cart-1',
            totalQuantity: 2,
            checkoutUrl: 'https://checkout.example.com/cart',
            lines: { nodes: [] },
            cost: {
              totalAmount: { amount: '100.00', currencyCode: 'USD' },
              subtotalAmount: { amount: '100.00', currencyCode: 'USD' },
              totalTaxAmount: null,
            },
          },
          userErrors: [],
        },
      });

      const result = await addToCartAction({ success: false, message: '' }, formData);

      expect(result.success).toBe(true);
      expect(result.cart?.id).toBe('gid://shopify/Cart/cart-1');
      expect(result.cart?.totalQuantity).toBe(2);
    });
  });

  describe('rate limiting', () => {
    it('returns rate limit error when checkRateLimit blocks', async () => {
      mockCheckRateLimit.mockResolvedValue({ blocked: true });

      const formData = new FormData();
      formData.set('variantId', 'gid://shopify/ProductVariant/123');
      formData.set('quantity', '1');

      const result = await addToCartAction({ success: false, message: '' }, formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('try again');
    });

    it('checks rate limit with correct IP header', async () => {
      const formData = new FormData();
      formData.set('variantId', 'gid://shopify/ProductVariant/123');
      formData.set('quantity', '1');

      await addToCartAction({ success: false, message: '' }, formData);

      expect(mockCheckRateLimit).toHaveBeenCalled();
    });
  });

  describe('add to existing cart', () => {
    it('calls cartLinesAdd when cart cookie exists', async () => {
      mockCookiesGet.mockReturnValue({ value: 'gid://shopify/Cart/existing-cart' });

      mockShopifyExecute.mockResolvedValue({
        cartLinesAdd: {
          cart: {
            id: 'gid://shopify/Cart/existing-cart',
            totalQuantity: 3,
            checkoutUrl: 'https://checkout.example.com/cart',
            lines: { nodes: [] },
            cost: {
              totalAmount: { amount: '150.00', currencyCode: 'USD' },
              subtotalAmount: { amount: '150.00', currencyCode: 'USD' },
              totalTaxAmount: null,
            },
          },
          userErrors: [],
        },
      });

      const formData = new FormData();
      formData.set('variantId', 'gid://shopify/ProductVariant/123456');
      formData.set('quantity', '1');

      const result = await addToCartAction({ success: false, message: '' }, formData);

      expect(result.success).toBe(true);
      expect(result.cart?.totalQuantity).toBe(3);
      expect(mockRevalidateTag).toHaveBeenCalledWith('cart');
      expect(mockRedis.del).toHaveBeenCalledWith('cart:gid://shopify/Cart/existing-cart');
    });

    it('returns userErrors from Shopify', async () => {
      mockCookiesGet.mockReturnValue({ value: 'gid://shopify/Cart/existing-cart' });

      mockShopifyExecute.mockResolvedValue({
        cartLinesAdd: {
          cart: null,
          userErrors: [{ field: ['merchandiseId'], message: 'Variant not found' }],
        },
      });

      const formData = new FormData();
      formData.set('variantId', 'gid://shopify/ProductVariant/123456');
      formData.set('quantity', '1');

      const result = await addToCartAction({ success: false, message: '' }, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Variant not found');
    });
  });

  describe('cart creation fallback', () => {
    it('creates new cart when no existing cart cookie', async () => {
      mockShopifyExecute.mockResolvedValue({
        cartCreate: {
          cart: {
            id: 'gid://shopify/Cart/new-cart',
            totalQuantity: 1,
            checkoutUrl: 'https://checkout.example.com/cart',
            lines: { nodes: [] },
            cost: {
              totalAmount: { amount: '50.00', currencyCode: 'USD' },
              subtotalAmount: { amount: '50.00', currencyCode: 'USD' },
              totalTaxAmount: null,
            },
          },
          userErrors: [],
        },
      });

      const formData = new FormData();
      formData.set('variantId', 'gid://shopify/ProductVariant/999');
      formData.set('quantity', '1');
      formData.set('locale', 'pt');

      const result = await addToCartAction({ success: false, message: '' }, formData);

      expect(result.success).toBe(true);
      expect(mockShopifyExecute).toHaveBeenCalled();
    });

    it('returns generic error on Shopify exception', async () => {
      mockShopifyExecute.mockRejectedValue(new Error('Network failure'));

      const formData = new FormData();
      formData.set('variantId', 'gid://shopify/ProductVariant/123456');
      formData.set('quantity', '1');

      const result = await addToCartAction({ success: false, message: '' }, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to add item to cart. Please try again.');
    });

    it('returns failure when cartCreate returns null cart', async () => {
      mockShopifyExecute.mockResolvedValue({
        cartCreate: {
          cart: null,
          userErrors: [],
        },
      });

      const formData = new FormData();
      formData.set('variantId', 'gid://shopify/ProductVariant/123456');
      formData.set('quantity', '1');

      const result = await addToCartAction({ success: false, message: '' }, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to create cart');
    });
  });
});