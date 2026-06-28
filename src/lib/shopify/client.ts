import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { shopifyBreaker } from '@/lib/circuit-breaker';
import { getRedisClient } from '@/lib/redis/client';
import { logger } from '@/lib/logger';
import { getRegion } from '@/lib/regions';
import { getEnv } from '@/lib/env';

export function isShopifyConfigured(locale: string): boolean {
  const region = getRegion(locale);
  const token = getTokenForRegion(region.code);
  const domain = region.shopifyDomain;
  // ponytail: skip API when .env.local still has placeholder test-* credentials
  if (!domain || !token) return false;
  if (domain.includes('test-') || token.startsWith('test-token')) return false;
  return true;
}

function getTokenForRegion(regionCode: string): string {
  const env = getEnv();
  const map: Record<string, string> = {
    US: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US,
    EU: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU,
    BR: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR,
    APAC: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_APAC,
  };
  return map[regionCode] ?? env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US;
}

const clientCache = new Map<string, ReturnType<typeof createStorefrontApiClient>>();

export function getShopifyClient(locale: string) {
  const region = getRegion(locale);
  const cacheKey = region.code;

  if (clientCache.has(cacheKey)) {
    const cached = clientCache.get(cacheKey)!;
    return buildExecutor(cached, locale);
  }

  const storeDomain = region.shopifyDomain;
  const publicAccessToken = getTokenForRegion(region.code);

  if (!storeDomain || !publicAccessToken) {
    throw new Error(`Credenciais Shopify não encontradas para a região: ${region.code}`);
  }

  const client = createStorefrontApiClient({
    storeDomain,
    apiVersion: getEnv().SHOPIFY_API_VERSION,
    publicAccessToken,
  });

  clientCache.set(cacheKey, client);
  return buildExecutor(client, locale);
}

function buildExecutor(client: ReturnType<typeof createStorefrontApiClient>, locale: string) {
  return {
    execute: async <T>(
      query: string,
      variables: Record<string, any> = {},
      cacheKey?: string
    ): Promise<T> => {
      return shopifyBreaker.execute(async () => {
        try {
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