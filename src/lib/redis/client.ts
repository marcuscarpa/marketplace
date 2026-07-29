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

function normalizeRedisUrl(url: string): string {
  const trimmed = url.trim();
  if (/^redis(s)?:\/\//i.test(trimmed)) return trimmed;
  // ponytail: Railway sometimes shows host:port without scheme
  return `redis://${trimmed}`;
}

function isRailwayPrivateHost(url: string): boolean {
  try {
    return new URL(normalizeRedisUrl(url)).hostname.endsWith('.railway.internal');
  } catch {
    return url.includes('.railway.internal');
  }
}

function redisOptions(url: string) {
  const normalized = normalizeRedisUrl(url);
  const options: {
    maxRetriesPerRequest: number;
    enableReadyCheck: boolean;
    connectTimeout: number;
    lazyConnect: boolean;
    family?: number;
  } = {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    connectTimeout: 5000,
    lazyConnect: true,
  };

  // Railway private network — dual-stack DNS (see docs.railway.com Redis troubleshooting)
  if (isRailwayPrivateHost(normalized)) {
    options.family = 0;
  }

  return options;
}

function createRedisClient(url: string): Redis {
  const normalized = normalizeRedisUrl(url);
  return new Redis(normalized, redisOptions(url));
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
      const client = createRedisClient(urlKey);
      clients.set(urlKey, client);
      return client;
    }
  }

  const defaultUrl = getEnv().REDIS_URL;
  const cached = clients.get(defaultUrl);
  if (cached) return cached;
  const client = createRedisClient(defaultUrl);
  clients.set(defaultUrl, client);
  return client;
}