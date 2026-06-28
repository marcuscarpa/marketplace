import { getRedisClient } from '@/lib/redis/client';
import { withLock } from './lock';
import { logger } from '@/lib/logger';

async function refreshCache<T>(key: string, fetchFn: () => Promise<T>, ttl: number) {
  try {
    const redis = getRedisClient();
    const data = await fetchFn();
    await redis.set(key, JSON.stringify({ data }), 'EX', ttl);
  } catch (error) {
    logger.warn('Background cache refresh failed', { key, error });
  }
}

export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = 3600
): Promise<T> {
  const redis = getRedisClient();

  const cached = await redis.get(key);
  if (cached !== null) {
    try {
      const parsed = JSON.parse(cached);
      return parsed.data;
    } catch {
      // Corrupted cache entry, re-fetch
    }
  }

  return withLock(key, async () => {
    const cachedAgain = await redis.get(key);
    if (cachedAgain !== null) {
      try {
        return JSON.parse(cachedAgain).data;
      } catch {
        // Corrupted cache entry, re-fetch
      }
    }
    const data = await fetchFn();
    await redis.set(key, JSON.stringify({ data }), 'EX', ttl);
    return data;
  });
}

