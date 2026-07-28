import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isShopifyConfigured } from '@/lib/shopify/client';
import { resetRegionsCache } from '@/lib/regions';

const mockEnv = vi.hoisted(() => ({
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_US: 'real-token-us',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU: 'real-token-eu',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR: 'real-token-br',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_APAC: 'real-token-apac',
  SHOPIFY_STORE_DOMAIN_US: 'store-us.myshopify.com',
  SHOPIFY_STORE_DOMAIN_EU: 'store-eu.myshopify.com',
  SHOPIFY_STORE_DOMAIN_BR: 'store-br.myshopify.com',
  SHOPIFY_STORE_DOMAIN_APAC: 'store-apac.myshopify.com',
  NEXT_PUBLIC_DEFAULT_LOCALE: 'en',
  SHOPIFY_CLIENT_ID: 'client-id',
  SHOPIFY_CLIENT_SECRET: 'client-secret',
  SHOPIFY_WEBHOOK_SECRET: 'webhook-secret',
  SHOPIFY_API_VERSION: '2026-04',
  REDIS_URL: 'redis://localhost:6379',
  RATE_LIMIT_FAIL_OPEN: 'false',
}));

vi.mock('@/lib/env', () => ({
  getEnv: () => mockEnv,
}));

vi.mock('@/lib/redis/client', () => ({
  getRedisClient: () => ({ get: vi.fn(), set: vi.fn() }),
}));

describe('Shopify Client', () => {
  beforeEach(() => {
    resetRegionsCache();
  });

  describe('isShopifyConfigured', () => {
    it('returns true when region has valid credentials', () => {
      expect(isShopifyConfigured('en-US')).toBe(true);
    });

    it('returns false when domain includes test- prefix', () => {
      mockEnv.SHOPIFY_STORE_DOMAIN_US = 'test-store.myshopify.com';
      expect(isShopifyConfigured('en-US')).toBe(false);
      mockEnv.SHOPIFY_STORE_DOMAIN_US = 'store-us.myshopify.com';
    });

    it('returns false when token starts with test-token and client credentials are placeholders', () => {
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US = 'test-token-us';
      mockEnv.SHOPIFY_CLIENT_ID = 'test-client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'test-client-secret';
      expect(isShopifyConfigured('en-US')).toBe(false);
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US = 'real-token-us';
      mockEnv.SHOPIFY_CLIENT_ID = 'client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'client-secret';
    });

    it('returns false when token is empty and client credentials are placeholders', () => {
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US = '';
      mockEnv.SHOPIFY_CLIENT_ID = 'test-client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'test-client-secret';
      expect(isShopifyConfigured('en-US')).toBe(false);
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US = 'real-token-us';
      mockEnv.SHOPIFY_CLIENT_ID = 'client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'client-secret';
    });

    it('returns true when client credentials are set even without static storefront token', () => {
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US = 'auto';
      mockEnv.SHOPIFY_CLIENT_ID = 'real-client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'real-client-secret';
      expect(isShopifyConfigured('en-US')).toBe(true);
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US = 'real-token-us';
      mockEnv.SHOPIFY_CLIENT_ID = 'client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'client-secret';
    });

    it('returns false when token is empty', () => {
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US = '';
      mockEnv.SHOPIFY_CLIENT_ID = 'test-client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'test-client-secret';
      expect(isShopifyConfigured('en-US')).toBe(false);
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US = 'real-token-us';
      mockEnv.SHOPIFY_CLIENT_ID = 'client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'client-secret';
    });

    it('returns false when domain is empty', () => {
      mockEnv.SHOPIFY_STORE_DOMAIN_US = '';
      expect(isShopifyConfigured('en-US')).toBe(false);
      mockEnv.SHOPIFY_STORE_DOMAIN_US = 'store-us.myshopify.com';
    });

    it('returns false when region token is missing and US token is test-token', () => {
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US = 'test-token-us';
      mockEnv.SHOPIFY_CLIENT_ID = 'test-client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'test-client-secret';
      expect(isShopifyConfigured('pt-BR')).toBe(false);
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US = 'real-token-us';
      mockEnv.SHOPIFY_CLIENT_ID = 'client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'client-secret';
    });

    it('checks EU region credentials', () => {
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU = 'test-token-eu';
      mockEnv.SHOPIFY_CLIENT_ID = 'test-client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'test-client-secret';
      expect(isShopifyConfigured('eu')).toBe(false);
      mockEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU = 'real-token-eu';
      mockEnv.SHOPIFY_CLIENT_ID = 'client-id';
      mockEnv.SHOPIFY_CLIENT_SECRET = 'client-secret';
    });

    it('returns true for APAC when credentials are valid', () => {
      expect(isShopifyConfigured('ja-JP')).toBe(true);
    });
  });
});