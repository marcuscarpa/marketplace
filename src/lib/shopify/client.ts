import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { shopifyBreaker } from '@/lib/circuit-breaker';
import { getRedisClient } from '@/lib/redis/client';
import { logger } from '@/lib/logger';
import { getRegion } from '@/lib/regions';
import { getEnv } from '@/lib/env';
import {
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

function isPlaceholderDomain(domain: string): boolean {
  return !domain || domain.includes('test-') || domain.includes('dev-placeholder');
}

export function isShopifyConfigured(locale: string): boolean {
  try {
    const region = getRegion(locale);
    const domain = region.shopifyDomain;
    const token = getStaticTokenForRegion(region.code);

    if (isPlaceholderDomain(domain)) return false;
    if (hasStaticStorefrontToken(token)) return true;
    return region.code === 'US' && hasClientCredentials();
  } catch {
    return false;
  }
}

type CachedClient = ReturnType<typeof createStorefrontApiClient>;
const clientCache = new Map<string, Promise<CachedClient>>();

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

        try {
          const client = await getOrCreateClient(region.code, storeDomain);
          const response = await client.request(query, { variables });

          if (response.errors) {
            throw new Error(`Shopify GraphQL Error: ${JSON.stringify(response.errors)}`);
          }

          if (cacheKey && response.data) {
            const redis = getRedisClient();
            redis.set(cacheKey, JSON.stringify(response.data), 'EX', 3600).catch(console.error);
          }

          return response.data as T;
        } catch (error) {
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
      });
    },
  };
}
