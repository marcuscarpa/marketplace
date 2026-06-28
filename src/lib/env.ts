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

export function getEnv(): Env {
  if (_env) return _env;
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map((e) => e.path.join('.')).join(', ');
    throw new Error(`Missing required environment variables: ${missing}`);
  }
  _env = result.data;
  return _env;
}
