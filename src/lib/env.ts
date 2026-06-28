import { z } from 'zod';

const envSchema = z.object({
  SHOPIFY_STORE_DOMAIN_US: z.string().min(1),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_US: z.string().min(1),
  SHOPIFY_STORE_DOMAIN_EU: z.string().min(1),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU: z.string().min(1),
  SHOPIFY_STORE_DOMAIN_BR: z.string().min(1),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR: z.string().min(1),
  SHOPIFY_STORE_DOMAIN_APAC: z.string().min(1),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_APAC: z.string().min(1),
  REDIS_URL: z.string().url(),
  REDIS_URL_US: z.string().url().optional(),
  REDIS_URL_EU: z.string().url().optional(),
  REDIS_URL_BR: z.string().url().optional(),
  REDIS_URL_APAC: z.string().url().optional(),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default('en'),
  SHOPIFY_CLIENT_ID: z.string().min(1),
  SHOPIFY_CLIENT_SECRET: z.string().min(1),
  SHOPIFY_WEBHOOK_SECRET: z.string().min(1),
  SHOPIFY_API_VERSION: z.string().default('2026-04'),
  RATE_LIMIT_FAIL_OPEN: z.string().default('false'),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

// ponytail: placeholder creds for build, local dev, and preview deploys without Shopify/Redis yet
const INTEGRATION_STUBS: Record<string, string> = {
  SHOPIFY_STORE_DOMAIN_US: 'dev-placeholder.myshopify.com',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_US: 'dev-placeholder',
  SHOPIFY_STORE_DOMAIN_EU: 'dev-placeholder.myshopify.com',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU: 'dev-placeholder',
  SHOPIFY_STORE_DOMAIN_BR: 'dev-placeholder.myshopify.com',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR: 'dev-placeholder',
  SHOPIFY_STORE_DOMAIN_APAC: 'dev-placeholder.myshopify.com',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_APAC: 'dev-placeholder',
  REDIS_URL: 'redis://127.0.0.1:6379',
  SHOPIFY_CLIENT_ID: 'dev-placeholder',
  SHOPIFY_CLIENT_SECRET: 'dev-placeholder',
  SHOPIFY_WEBHOOK_SECRET: 'dev-placeholder',
  RATE_LIMIT_FAIL_OPEN: 'true',
};

function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

/** True when real Shopify storefront credentials are configured (not placeholders). */
export function hasRealShopifyCredentials(): boolean {
  const domain = process.env.SHOPIFY_STORE_DOMAIN_US ?? '';
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US ?? '';
  if (!domain || !token) return false;
  if (domain.includes('dev-placeholder') || domain.includes('your-store')) return false;
  if (token === 'dev-placeholder' || token.startsWith('your_') || token.startsWith('test-token')) {
    return false;
  }
  return true;
}

function canUseIntegrationStubs(): boolean {
  return (
    isBuildPhase() ||
    process.env.NODE_ENV === 'development' ||
    process.env.ALLOW_INTEGRATION_STUBS === 'true' ||
    // ponytail: Vercel preview/prod without Shopify yet — merge stub env at runtime
    (process.env.VERCEL === '1' && !hasRealShopifyCredentials())
  );
}

/** Mock catalog / no Redis / no Shopify — local dev and Vercel staging. */
export function isIntegrationStubMode(): boolean {
  try {
    getEnv();
  } catch {
    return canUseIntegrationStubs();
  }
  return canUseIntegrationStubs() && !hasRealShopifyCredentials();
}

export function getEnv(): Env {
  if (_env) return _env;
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    if (canUseIntegrationStubs()) {
      const stubResult = envSchema.safeParse({ ...INTEGRATION_STUBS, ...process.env });
      if (stubResult.success) {
        _env = stubResult.data;
        return _env;
      }
    }
    const missing = result.error.issues.map((e) => e.path.join('.')).join(', ');
    throw new Error(`Missing required environment variables: ${missing}`);
  }
  _env = result.data;
  return _env;
}
