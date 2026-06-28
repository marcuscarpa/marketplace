import { getRedisClient } from '@/lib/redis/client';
import { getEnv } from '@/lib/env';

const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_BLOCK_DURATION = 300;

const BAD_BOT_PATTERNS = [
  /curl/i,
  /wget/i,
  /python-requests/i,
  /scrapy/i,
  /bot\/crawler/i,
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /hydra/i,
  /libwww-perl/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /dotbot/i,
  /mj12bot/i,
];

const GOOD_BOT_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
];

export interface BotCheckResult {
  blocked: boolean;
  reason?: string;
}

export function checkUserAgent(userAgent: string): BotCheckResult {
  if (!userAgent) {
    return { blocked: false };
  }

  for (const pattern of BAD_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return { blocked: true, reason: 'bad_bot' };
    }
  }

  for (const pattern of GOOD_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return { blocked: false, reason: 'good_bot' };
    }
  }

  return { blocked: false };
}

export async function checkRateLimit(
  ip: string
): Promise<BotCheckResult> {
  const redis = getRedisClient();
  const key = `ratelimit:${ip}`;
  const blockKey = `blocked:${ip}`;

  try {
    const isBlocked = await redis.exists(blockKey);
    if (isBlocked) {
      return { blocked: true, reason: 'rate_limit_blocked' };
    }

    const lua = `
      local count = redis.call('INCR', KEYS[1])
      if count == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[1])
      end
      return count
    `;
    const count = await redis.eval(lua, 1, key, String(RATE_LIMIT_WINDOW)) as number;

    if (count > RATE_LIMIT_MAX_REQUESTS) {
      await redis.setex(blockKey, RATE_LIMIT_BLOCK_DURATION, '1');
      return { blocked: true, reason: 'rate_limit_exceeded' };
    }
  } catch {
    const failOpen = getEnv().RATE_LIMIT_FAIL_OPEN === 'true';
    if (failOpen) {
      return { blocked: false, reason: 'redis_unavailable_fail_open' };
    }
    return { blocked: true, reason: 'redis_unavailable' };
  }

  return { blocked: false };
}

const TRUSTED_PROXY_HEADERS = [
  'x-vercel-forwarded-for',
  'x-forwarded-for',
] as const;

export function getClientIp(request: {
  headers: { get: (key: string) => string | null };
}): string {
  for (const header of TRUSTED_PROXY_HEADERS) {
    const value = request.headers.get(header);
    if (value) {
      const ip = value.split(',')[0]?.trim() ?? 'unknown';
      if (ip && ip !== 'unknown' && !isLoopbackOrPrivate(ip)) {
        return ip;
      }
    }
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function isLoopbackOrPrivate(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.20.') ||
    ip.startsWith('172.21.') ||
    ip.startsWith('172.22.') ||
    ip.startsWith('172.23.') ||
    ip.startsWith('172.24.') ||
    ip.startsWith('172.25.') ||
    ip.startsWith('172.26.') ||
    ip.startsWith('172.27.') ||
    ip.startsWith('172.28.') ||
    ip.startsWith('172.29.') ||
    ip.startsWith('172.30.') ||
    ip.startsWith('172.31.') ||
    ip.startsWith('192.168.')
  );
}
