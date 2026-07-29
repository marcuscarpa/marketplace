import { getEnv } from '@/lib/env';
import { getRedisClient } from '@/lib/redis/client';
import { logger } from '@/lib/logger';

const TOKEN_TITLE = 'Sinesia Headless Frontend';
const ADMIN_TOKEN_CACHE_MS = 23 * 60 * 60 * 1000;
const REDIS_READ_TIMEOUT_MS = 500;
const STOREFRONT_TOKEN_REDIS_KEY = (region: string) => `shopify:storefront_token:${region}`;

async function redisGetSafe(key: string): Promise<string | null> {
  try {
    const redis = getRedisClient();
    return await Promise.race([
      redis.get(key),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), REDIS_READ_TIMEOUT_MS);
      }),
    ]);
  } catch {
    return null;
  }
}

type CachedAdminToken = { token: string; expiresAt: number };
const adminTokenCache = new Map<string, CachedAdminToken>();

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return (
    value === 'auto' ||
    value === 'dev-placeholder' ||
    value.startsWith('test-token') ||
    value.startsWith('your_') ||
    value === 'test-client-id' ||
    value === 'test-client-secret'
  );
}

export function hasStaticStorefrontToken(token: string | undefined): boolean {
  return !!token && !isPlaceholder(token);
}

export function hasClientCredentials(): boolean {
  const env = getEnv();
  return !isPlaceholder(env.SHOPIFY_CLIENT_ID) && !isPlaceholder(env.SHOPIFY_CLIENT_SECRET);
}

async function fetchAdminAccessToken(storeDomain: string): Promise<string> {
  const cached = adminTokenCache.get(storeDomain);
  if (cached && Date.now() < cached.expiresAt - 60_000) return cached.token;

  const env = getEnv();
  const response = await fetch(`https://${storeDomain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.SHOPIFY_CLIENT_ID,
      client_secret: env.SHOPIFY_CLIENT_SECRET,
    }),
  });

  const text = await response.text();
  let body: { access_token?: string; expires_in?: number; error?: string; error_description?: string };
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`Shopify admin token failed (${response.status}): ${text.slice(0, 200)}`);
  }

  if (!response.ok || !body.access_token) {
    throw new Error(
      `Shopify admin token failed (${response.status}): ${body.error_description ?? body.error ?? text.slice(0, 200)}`
    );
  }

  adminTokenCache.set(storeDomain, {
    token: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 86_400) * 1000,
  });

  return body.access_token;
}

async function adminGraphql<T>(
  storeDomain: string,
  adminToken: string,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const env = getEnv();
  const response = await fetch(`https://${storeDomain}/admin/api/${env.SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const body = await response.json();
  if (!response.ok || body.errors?.length) {
    throw new Error(`Shopify Admin GraphQL error: ${JSON.stringify(body.errors ?? body)}`);
  }
  return body.data as T;
}

async function createStorefrontAccessToken(storeDomain: string, adminToken: string): Promise<string> {
  const data = await adminGraphql<{
    storefrontAccessTokenCreate: {
      storefrontAccessToken: { accessToken: string } | null;
      userErrors: Array<{ message: string }>;
    };
  }>(
    storeDomain,
    adminToken,
    `mutation CreateStorefrontToken($input: StorefrontAccessTokenInput!) {
      storefrontAccessTokenCreate(input: $input) {
        storefrontAccessToken { accessToken }
        userErrors { field message }
      }
    }`,
    { input: { title: TOKEN_TITLE } }
  );

  const result = data.storefrontAccessTokenCreate;
  if (result.userErrors?.length) {
    throw new Error(`storefrontAccessTokenCreate: ${result.userErrors.map((e) => e.message).join(', ')}`);
  }
  const token = result.storefrontAccessToken?.accessToken;
  if (!token) throw new Error('storefrontAccessTokenCreate returned no token');
  return token;
}

async function resolveStorefrontTokenFromCredentials(
  storeDomain: string,
  regionCode: string
): Promise<string> {
  try {
    const cached = await redisGetSafe(STOREFRONT_TOKEN_REDIS_KEY(regionCode));
    if (cached) return cached;
  } catch (error) {
    logger.warn('[shopify/token] Redis cache miss for storefront token', { regionCode, error });
  }

  const adminToken = await fetchAdminAccessToken(storeDomain);
  const storefrontToken = await createStorefrontAccessToken(storeDomain, adminToken);

  try {
    const redis = getRedisClient();
    await redis.set(STOREFRONT_TOKEN_REDIS_KEY(regionCode), storefrontToken);
  } catch (error) {
    logger.warn('[shopify/token] Failed to cache storefront token in Redis', { regionCode, error });
  }

  return storefrontToken;
}

export async function resolveStorefrontAccessToken(
  regionCode: string,
  storeDomain: string,
  staticToken?: string
): Promise<string> {
  if (hasStaticStorefrontToken(staticToken)) return staticToken!;
  if (!hasClientCredentials()) {
    throw new Error(`Credenciais Shopify incompletas para região ${regionCode}`);
  }
  return resolveStorefrontTokenFromCredentials(storeDomain, regionCode);
}
