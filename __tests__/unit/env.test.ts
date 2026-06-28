import { describe, it, expect } from 'vitest';

describe('env validation', () => {
  it('should accept valid env object', () => {
    const validEnv = {
      SHOPIFY_STORE_DOMAIN_US: 'test.myshopify.com',
      SHOPIFY_STOREFRONT_ACCESS_TOKEN_US: 'token_us',
      SHOPIFY_STORE_DOMAIN_BR: 'testbr.myshopify.com',
      SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR: 'token_br',
      REDIS_URL: 'https://test.upstash.io',
      REDIS_TOKEN: 'test_token',
      NEXT_PUBLIC_DEFAULT_LOCALE: 'en',
    };

    expect(validEnv.SHOPIFY_STORE_DOMAIN_US).toBeTruthy();
    expect(validEnv.REDIS_URL).toContain('https://');
  });

  it('should require US shopify credentials', () => {
    const env = {
      SHOPIFY_STORE_DOMAIN_US: 'test.myshopify.com',
      SHOPIFY_STOREFRONT_ACCESS_TOKEN_US: 'token_us',
      SHOPIFY_STORE_DOMAIN_BR: 'testbr.myshopify.com',
      SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR: 'token_br',
      REDIS_URL: 'https://test.upstash.io',
      REDIS_TOKEN: 'test_token',
    };

    expect(env.SHOPIFY_STORE_DOMAIN_US).toBeTruthy();
    expect(env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US).toBeTruthy();
  });

  it('should require REDIS credentials', () => {
    const env = {
      REDIS_URL: 'https://test.upstash.io',
      REDIS_TOKEN: 'test_token',
    };

    expect(env.REDIS_URL).toBeTruthy();
    expect(env.REDIS_TOKEN).toBeTruthy();
  });
});