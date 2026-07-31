import { getEnv } from '@/lib/env';
import { getRedisClient } from '@/lib/redis/client';
import { logger } from '@/lib/logger';

const TOKEN_TITLE = 'Sinesia Headless Frontend';
const ADMIN_TOKEN_CACHE_MS = 23 * 60 * 60 * 1000;
const STOREFRONT_TOKEN_REDIS_KEY = (region: string) => `shopify:storefront_token:${region}`;
const REVOCABLE_STOREFRONT_TOKEN_TITLES = new Set([TOKEN_TITLE, 'stock-check']);

type CachedAdminToken = { token: string; expiresAt: number };
const adminTokenCache = new Map<string, CachedAdminToken>();
const storefrontTokenMemoryCache = new Map<string, string>();

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

async function pruneStorefrontAccessTokens(storeDomain: string, adminToken: string): Promise<void> {
  const data = await adminGraphql<{
    shop: { storefrontAccessTokens: { nodes: Array<{ id: string; title: string; createdAt: string }> } };
  }>(
    storeDomain,
    adminToken,
    `{ shop { storefrontAccessTokens(first: 50) { nodes { id title createdAt } } } }`
  );

  const revocable = data.shop.storefrontAccessTokens.nodes
    .filter((token) => REVOCABLE_STOREFRONT_TOKEN_TITLES.has(token.title))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  for (const token of revocable) {
    await adminGraphql(
      storeDomain,
      adminToken,
      `mutation DeleteStorefrontToken($input: StorefrontAccessTokenDeleteInput!) {
        storefrontAccessTokenDelete(input: $input) {
          deletedStorefrontAccessTokenId
          userErrors { message }
        }
      }`,
      { input: { id: token.id } }
    );
  }
}

async function createStorefrontAccessTokenWithRetry(
  storeDomain: string,
  adminToken: string
): Promise<string> {
  try {
    return await createStorefrontAccessToken(storeDomain, adminToken);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('limit')) throw error;
    logger.warn('[shopify/token] Storefront token limit reached — pruning dev tokens', { storeDomain });
    await pruneStorefrontAccessTokens(storeDomain, adminToken);
    return createStorefrontAccessToken(storeDomain, adminToken);
  }
}

async function cacheStorefrontToken(regionCode: string, token: string): Promise<void> {
  storefrontTokenMemoryCache.set(regionCode, token);
  try {
    const redis = getRedisClient();
    await redis.set(STOREFRONT_TOKEN_REDIS_KEY(regionCode), token);
  } catch (error) {
    logger.warn('[shopify/token] Failed to cache storefront token in Redis', { regionCode, error });
  }
}

async function readCachedStorefrontToken(regionCode: string): Promise<string | null> {
  const memory = storefrontTokenMemoryCache.get(regionCode);
  if (memory) return memory;

  try {
    const redis = getRedisClient();
    const cached = await redis.get(STOREFRONT_TOKEN_REDIS_KEY(regionCode));
    if (cached) {
      storefrontTokenMemoryCache.set(regionCode, cached);
      return cached;
    }
  } catch (error) {
    logger.warn('[shopify/token] Redis cache miss for storefront token', { regionCode, error });
  }

  return null;
}

export async function clearStorefrontTokenCache(regionCode: string): Promise<void> {
  storefrontTokenMemoryCache.delete(regionCode);
  try {
    const redis = getRedisClient();
    await redis.del(STOREFRONT_TOKEN_REDIS_KEY(regionCode));
  } catch (error) {
    logger.warn('[shopify/token] Failed to clear storefront token cache', { regionCode, error });
  }
}

async function resolveStorefrontTokenFromCredentials(
  storeDomain: string,
  regionCode: string
): Promise<string> {
  const cached = await readCachedStorefrontToken(regionCode);
  if (cached) return cached;

  const adminToken = await fetchAdminAccessToken(storeDomain);
  const storefrontToken = await createStorefrontAccessTokenWithRetry(storeDomain, adminToken);
  await cacheStorefrontToken(regionCode, storefrontToken);
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
