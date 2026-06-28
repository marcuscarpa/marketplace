import { describe, it, expect, vi, beforeEach } from 'vitest';

import { checkUserAgent, getClientIp } from '@/lib/security/bot-protection';
import { buildCspHeader, buildSecurityHeaders } from '@/lib/security/csp';

const { mockRedis } = vi.hoisted(() => ({
  mockRedis: {
    exists: vi.fn(),
    eval: vi.fn(),
    setex: vi.fn(),
  },
}));

vi.mock('@/lib/redis/client', () => ({
  getRedisClient: () => mockRedis,
}));

describe('buildCspHeader', () => {
  it('includes nonce in script-src directive', () => {
    const csp = buildCspHeader({ nonce: 'test-nonce-123', isProduction: true });
    expect(csp).toContain("script-src 'self' 'nonce-test-nonce-123' 'strict-dynamic'");
  });

  it('includes strict-dynamic in script-src', () => {
    const csp = buildCspHeader({ nonce: 'abc', isProduction: true });
    expect(csp).toContain("'strict-dynamic'");
  });

  it('includes shopify CDN in img-src', () => {
    const csp = buildCspHeader({ nonce: 'abc', isProduction: true });
    expect(csp).toContain('https://cdn.shopify.com');
  });

  it('sets frame-ancestors to none', () => {
    const csp = buildCspHeader({ nonce: 'abc', isProduction: true });
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it('sets object-src to none', () => {
    const csp = buildCspHeader({ nonce: 'abc', isProduction: true });
    expect(csp).toContain("object-src 'none'");
  });

  it('includes upgrade-insecure-requests', () => {
    const csp = buildCspHeader({ nonce: 'abc', isProduction: true });
    expect(csp).toContain('upgrade-insecure-requests');
  });

  it('allows unsafe-eval in development', () => {
    const csp = buildCspHeader({ nonce: 'abc', isProduction: false });
    expect(csp).toContain("'unsafe-eval'");
  });

  it('does not allow unsafe-eval in production', () => {
    const csp = buildCspHeader({ nonce: 'abc', isProduction: true });
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it('includes form-action with shopify', () => {
    const csp = buildCspHeader({ nonce: 'abc', isProduction: true });
    expect(csp).toContain("form-action 'self' https://*.shopify.com");
  });
});

describe('buildSecurityHeaders', () => {
  it('sets X-Frame-Options to DENY', () => {
    const headers = buildSecurityHeaders();
    expect(headers['X-Frame-Options']).toBe('DENY');
  });

  it('sets X-Content-Type-Options to nosniff', () => {
    const headers = buildSecurityHeaders();
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
  });

  it('sets Strict-Transport-Security with preload', () => {
    const headers = buildSecurityHeaders();
    expect(headers['Strict-Transport-Security']).toContain('preload');
  });

  it('sets Referrer-Policy', () => {
    const headers = buildSecurityHeaders();
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
  });

  it('sets Permissions-Policy restricting camera and microphone', () => {
    const headers = buildSecurityHeaders();
    expect(headers['Permissions-Policy']).toContain('camera=()');
    expect(headers['Permissions-Policy']).toContain('microphone=()');
  });

  it('sets Cross-Origin-Opener-Policy', () => {
    const headers = buildSecurityHeaders();
    expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin');
  });
});

describe('checkUserAgent', () => {
  it('blocks curl user-agent', () => {
    const result = checkUserAgent('curl/7.81.0');
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('bad_bot');
  });

  it('blocks wget user-agent', () => {
    const result = checkUserAgent('Wget/1.21.2');
    expect(result.blocked).toBe(true);
  });

  it('blocks sqlmap user-agent', () => {
    const result = checkUserAgent('sqlmap/1.6');
    expect(result.blocked).toBe(true);
  });

  it('blocks python-requests user-agent', () => {
    const result = checkUserAgent('python-requests/2.28.1');
    expect(result.blocked).toBe(true);
  });

  it('allows Googlebot', () => {
    const result = checkUserAgent('Googlebot/2.1');
    expect(result.blocked).toBe(false);
    expect(result.reason).toBe('good_bot');
  });

  it('allows Bingbot', () => {
    const result = checkUserAgent('Mozilla/5.0 (compatible; bingbot/2.0)');
    expect(result.blocked).toBe(false);
    expect(result.reason).toBe('good_bot');
  });

  it('allows regular browser user-agent', () => {
    const result = checkUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    expect(result.blocked).toBe(false);
    expect(result.reason).toBeUndefined();
  });

  it('allows empty user-agent', () => {
    const result = checkUserAgent('');
    expect(result.blocked).toBe(false);
  });

  it('blocks scrapy user-agent', () => {
    const result = checkUserAgent('Scrapy/2.7.1');
    expect(result.blocked).toBe(true);
  });

  it('blocks nikto scanner', () => {
    const result = checkUserAgent('Nikto/2.1.6');
    expect(result.blocked).toBe(true);
  });
});

describe('getClientIp', () => {
  it('extracts IP from x-forwarded-for header', () => {
    const request = {
      headers: {
        get: (key: string) =>
          key === 'x-forwarded-for' ? '203.0.113.1, 10.0.0.1' : null,
      },
    };
    expect(getClientIp(request)).toBe('203.0.113.1');
  });

  it('falls back to x-real-ip when x-forwarded-for is missing', () => {
    const request = {
      headers: {
        get: (key: string) =>
          key === 'x-real-ip' ? '10.0.0.2' : null,
      },
    };
    expect(getClientIp(request)).toBe('10.0.0.2');
  });

  it('returns unknown when no IP headers present', () => {
    const request = {
      headers: {
        get: () => null,
      },
    };
    expect(getClientIp(request)).toBe('unknown');
  });

  it('handles single IP in x-forwarded-for', () => {
    const request = {
      headers: {
        get: (key: string) =>
          key === 'x-forwarded-for' ? '203.0.113.50' : null,
      },
    };
    expect(getClientIp(request)).toBe('203.0.113.50');
  });

  it('skips private IPs in x-forwarded-for and falls back to x-real-ip', () => {
    const request = {
      headers: {
        get: (key: string) => {
          if (key === 'x-forwarded-for') return '192.168.1.1';
          if (key === 'x-real-ip') return '203.0.113.99';
          return null;
        },
      },
    };
    expect(getClientIp(request)).toBe('203.0.113.99');
  });
});

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('allows request when under rate limit', async () => {
    mockRedis.exists.mockResolvedValue(0);
    mockRedis.eval.mockResolvedValue(1);
    const { checkRateLimit } = await import('@/lib/security/bot-protection');
    const result = await checkRateLimit('203.0.113.1');
    expect(result.blocked).toBe(false);
  });

  it('blocks request when already blocked', async () => {
    mockRedis.exists.mockResolvedValue(1);
    const { checkRateLimit } = await import('@/lib/security/bot-protection');
    const result = await checkRateLimit('192.168.1.2');
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('rate_limit_blocked');
  });

  it('blocks request when rate limit exceeded', async () => {
    mockRedis.exists.mockResolvedValue(0);
    mockRedis.eval.mockResolvedValue(101);
    const { checkRateLimit } = await import('@/lib/security/bot-protection');
    const result = await checkRateLimit('203.0.113.3');
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('rate_limit_exceeded');
  });

  it('allows request when Redis is unavailable', async () => {
    mockRedis.exists.mockRejectedValue(new Error('Redis unavailable'));
    const { checkRateLimit } = await import('@/lib/security/bot-protection');
    const result = await checkRateLimit('192.168.1.4');
    expect(result.blocked).toBe(false);
  });
});
