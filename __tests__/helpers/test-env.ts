/** Minimal env for vitest — satisfies getEnv() / regions without .env.local */
export const TEST_ENV: Record<string, string> = {
  SHOPIFY_STORE_DOMAIN_US: 'test-us.myshopify.com',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_US: 'test-token-us',
  SHOPIFY_STORE_DOMAIN_EU: 'test-eu.myshopify.com',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU: 'test-token-eu',
  SHOPIFY_STORE_DOMAIN_BR: 'test-br.myshopify.com',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR: 'test-token-br',
  SHOPIFY_STORE_DOMAIN_APAC: 'test-apac.myshopify.com',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_APAC: 'test-token-apac',
  REDIS_URL: 'https://test.upstash.io',
  REDIS_TOKEN: 'test-redis-token',
  SHOPIFY_CLIENT_ID: 'test-client-id',
  SHOPIFY_CLIENT_SECRET: 'test-client-secret',
  SHOPIFY_WEBHOOK_SECRET: 'test-webhook-secret',
  NEXT_PUBLIC_DEFAULT_LOCALE: 'en',
  RATE_LIMIT_FAIL_OPEN: 'true',
};

export function applyTestEnv(): void {
  for (const [key, value] of Object.entries(TEST_ENV)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
