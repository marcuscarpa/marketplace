import { getRedisClient } from '@/lib/redis/client';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const redis = getRedisClient();
  const rateKey = `ratelimit:${key}`;
  const now = Date.now();
  const windowSec = Math.ceil(windowMs / 1000);

  try {
    const lua = `
      local count = redis.call('INCR', KEYS[1])
      if count == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[1])
      end
      return count
    `;
    const count = await redis.eval(lua, 1, rateKey, String(windowSec)) as number;

    if (count > limit) {
      return { allowed: false, remaining: 0, reset: now + windowMs };
    }

    return { allowed: true, remaining: limit - count, reset: now + windowMs };
  } catch {
    return { allowed: false, remaining: 0, reset: now + windowMs };
  }
}