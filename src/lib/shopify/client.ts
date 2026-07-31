import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { isPlaceholderShopifyDomain } from '@/lib/cart/checkout';
import { shopifyBreaker } from '@/lib/circuit-breaker';
import { getRedisClient } from '@/lib/redis/client';
import { logger } from '@/lib/logger';
import { getRegion } from '@/lib/regions';
import { getEnv } from '@/lib/env';
import {
  clearStorefrontTokenCache,
  hasClientCredentials,
  hasStaticStorefrontToken,
  resolveStorefrontAccessToken,
} from '@/lib/shopify/token';

function getStaticTokenForRegion(regionCode: string): string {
  const env = getEnv();
  const map: Record<string, string> = {
    US: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US,
    EU: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU,
    BR: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR,
    APAC: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_APAC,
  };
  return map[regionCode] ?? env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US;
}

export function isShopifyConfigured(locale: string): boolean {
  try {
    const region = getRegion(locale);
    const domain = region.shopifyDomain;
    const token = getStaticTokenForRegion(region.code);

    if (isPlaceholderShopifyDomain(domain)) return false;
    if (hasStaticStorefrontToken(token)) return true;
    return region.code === 'US' && hasClientCredentials();
  } catch {
    return false;
  }
}

type CachedClient = ReturnType<typeof createStorefrontApiClient>;
const clientCache = new Map<string, Promise<CachedClient>>();
const SHOPIFY_REQUEST_TIMEOUT_MS = 8_000;

async function requestWithTimeout<T>(
  promise: Promise<T>,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`Shopify request timeout (${label})`)),
          SHOPIFY_REQUEST_TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function getOrCreateClient(regionCode: string, storeDomain: string): Promise<CachedClient> {
  const cacheKey = `${regionCode}:${storeDomain}`;
  const existing = clientCache.get(cacheKey);
  if (existing) return existing;

  const pending = (async () => {
    const staticToken = getStaticTokenForRegion(regionCode);
    const publicAccessToken = await resolveStorefrontAccessToken(regionCode, storeDomain, staticToken);

    return createStorefrontApiClient({
      storeDomain,
      apiVersion: getEnv().SHOPIFY_API_VERSION,
      publicAccessToken,
    });
  })();

  clientCache.set(cacheKey, pending);
  try {
    return await pending;
  } catch (error) {
    clientCache.delete(cacheKey);
    throw error;
  }
}

function invalidateShopifyClient(regionCode: string, storeDomain: string): void {
  clientCache.delete(`${regionCode}:${storeDomain}`);
}

function isStorefrontAuthError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /(401|403|unauthorized|invalid.*token|access denied|api key)/i.test(message);
}

export function getShopifyClient(locale: string) {
  const region = getRegion(locale);

  return {
    execute: async <T>(
      query: string,
      variables: Record<string, unknown> = {},
      cacheKey?: string
    ): Promise<T> => {
      return shopifyBreaker.execute(async () => {
        const storeDomain = region.shopifyDomain;
        const staticToken = getStaticTokenForRegion(region.code);

        if (!storeDomain || (!hasStaticStorefrontToken(staticToken) && !hasClientCredentials())) {
          throw new Error(`Credenciais Shopify não encontradas para a região: ${region.code}`);
        }

        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const client = await getOrCreateClient(region.code, storeDomain);
            const response = await requestWithTimeout(
              client.request(query, { variables }),
              region.code,
            );

            if (response.errors) {
              throw new Error(`Shopify GraphQL Error: ${JSON.stringify(response.errors)}`);
            }

            if (cacheKey && response.data) {
              const redis = getRedisClient();
              redis.set(cacheKey, JSON.stringify(response.data), 'EX', 3600).catch(console.error);
            }

            return response.data as T;
          } catch (error) {
            if (
              attempt === 0 &&
              isStorefrontAuthError(error) &&
              !hasStaticStorefrontToken(staticToken)
            ) {
              logger.warn('[shopify/client] Storefront auth failed — refreshing token cache', {
                region: region.code,
              });
              await clearStorefrontTokenCache(region.code);
              invalidateShopifyClient(region.code, storeDomain);
              continue;
            }

            if (cacheKey) {
              const redis = getRedisClient();
              const cachedData = await redis.get(cacheKey);
              if (cachedData) {
                try {
                  const parsed = JSON.parse(cachedData);
                  if (parsed && typeof parsed === 'object') {
                    logger.warn('[Graceful Degradation] Servindo dados de fallback do Redis', { cacheKey });
                    return parsed as T;
                  }
                } catch (parseError) {
                  logger.error('Falha ao parsear cache do Redis', { cacheKey, error: parseError });
                }
              }
            }
            throw error;
          }
        }

        throw new Error(`Shopify request failed for region: ${region.code}`);
      });
    },
  };
}
