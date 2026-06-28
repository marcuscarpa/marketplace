import Redis from 'ioredis';
import { getEnv } from '@/lib/env';
import { getRegion } from '@/lib/regions';

const REDIS_URL_KEYS: Record<string, string | undefined> = {
  US: process.env.REDIS_URL_US,
  EU: process.env.REDIS_URL_EU,
  BR: process.env.REDIS_URL_BR,
  APAC: process.env.REDIS_URL_APAC,
};

const clients = new Map<string, Redis>();

function redisOptions(url: string) {
  return {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    connectTimeout: 5000,
    lazyConnect: true,
  };
}

export function getRedisClient(localeOrRegion?: string): Redis {
  if (localeOrRegion) {
    const region = localeOrRegion.length <= 3
      ? localeOrRegion.toUpperCase()
      : getRegion(localeOrRegion).code;
    const urlKey = REDIS_URL_KEYS[region];
    if (urlKey) {
      const cached = clients.get(urlKey);
      if (cached) return cached;
      const client = new Redis(urlKey, redisOptions(urlKey));
      clients.set(urlKey, client);
      return client;
    }
  }

  const defaultUrl = getEnv().REDIS_URL;
  const cached = clients.get(defaultUrl);
  if (cached) return cached;
  const client = new Redis(defaultUrl, redisOptions(defaultUrl));
  clients.set(defaultUrl, client);
  return client;
}