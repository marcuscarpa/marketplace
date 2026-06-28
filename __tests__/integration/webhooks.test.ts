import { createHmac } from 'crypto';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const WEBHOOK_SECRET = 'test-webhook-secret';

beforeEach(() => {
  process.env.SHOPIFY_WEBHOOK_SECRET = WEBHOOK_SECRET;
  process.env.SHOPIFY_STORE_DOMAIN_US = 'test.myshopify.com';
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US = 'token';
  process.env.SHOPIFY_STORE_DOMAIN_BR = 'test-br.myshopify.com';
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR = 'token-br';
  process.env.REDIS_URL = 'https://redis.test';
  process.env.REDIS_TOKEN = 'redis-token';
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE = 'en';
  process.env.SHOPIFY_CLIENT_ID = 'client-id';
  process.env.SHOPIFY_CLIENT_SECRET = 'client-secret';
  vi.clearAllMocks();
  vi.resetModules();
  mockRedis.exists.mockResolvedValue(0);
});

afterEach(() => {
  delete process.env.SHOPIFY_WEBHOOK_SECRET;
});

const mockRedis = {
  exists: vi.fn(),
  setex: vi.fn(),
  publish: vi.fn(),
  lrange: vi.fn().mockResolvedValue([]),
  ltrim: vi.fn(),
};

vi.mock('@/lib/env', () => ({
  getEnv: vi.fn(() => ({
    SHOPIFY_WEBHOOK_SECRET: 'test-webhook-secret',
    SHOPIFY_STORE_DOMAIN_US: 'test.myshopify.com',
    SHOPIFY_STOREFRONT_ACCESS_TOKEN_US: 'token',
    SHOPIFY_STORE_DOMAIN_BR: 'test-br.myshopify.com',
    SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR: 'token-br',
    REDIS_URL: 'https://redis.test',
    REDIS_TOKEN: 'redis-token',
    NEXT_PUBLIC_DEFAULT_LOCALE: 'en',
    SHOPIFY_CLIENT_ID: 'client-id',
    SHOPIFY_CLIENT_SECRET: 'client-secret',
  })),
}));

vi.mock('@/lib/redis/client', () => ({
  getRedisClient: vi.fn(() => mockRedis),
}));

const mockRevalidateProducts = vi.fn();
const mockRevalidateCollections = vi.fn();
const mockRevalidateCart = vi.fn();
const mockRevalidateSearch = vi.fn();
const mockRevalidateAll = vi.fn();

vi.mock('@/lib/shopify/cache', () => ({
  revalidateProducts: mockRevalidateProducts,
  revalidateCollections: mockRevalidateCollections,
  revalidateCart: mockRevalidateCart,
  revalidateSearch: mockRevalidateSearch,
  revalidateAll: mockRevalidateAll,
}));

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

function computeHmac(body: string): string {
  const hmac = createHmac('sha256', WEBHOOK_SECRET);
  hmac.update(body, 'utf8');
  return hmac.digest('base64');
}

function makeRequest(body: string, headers: Record<string, string>) {
  const req = new Request('http://localhost/api/webhooks', {
    method: 'POST',
    body,
    headers,
  });
  return req as unknown as import('next/server').NextRequest;
}

describe('Webhook HMAC validation', () => {
  it('rejects request with missing HMAC header', async () => {
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const req = makeRequest('{}', {
      'X-Shopify-Topic': 'products/create',
      'X-Shopify-Webhook-Id': 'wh-1',
      'X-Shopify-Triggered-At': new Date().toISOString(),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('rejects request with invalid HMAC', async () => {
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const body = '{"id":"gid://shopify/Product/1"}';
    const req = makeRequest(body, {
      'X-Shopify-Hmac-Sha256': 'invalid-hmac-value',
      'X-Shopify-Topic': 'products/create',
      'X-Shopify-Webhook-Id': 'wh-2',
      'X-Shopify-Triggered-At': new Date().toISOString(),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('accepts request with valid HMAC', async () => {
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const body = '{"id":"gid://shopify/Product/1"}';
    const req = makeRequest(body, {
      'X-Shopify-Hmac-Sha256': computeHmac(body),
      'X-Shopify-Topic': 'products/create',
      'X-Shopify-Webhook-Id': 'wh-3',
      'X-Shopify-Triggered-At': new Date().toISOString(),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});

describe('Webhook timestamp validation', () => {
  it('rejects request with missing timestamp', async () => {
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const body = '{"id":"1"}';
    const req = makeRequest(body, {
      'X-Shopify-Hmac-Sha256': computeHmac(body),
      'X-Shopify-Topic': 'products/create',
      'X-Shopify-Webhook-Id': 'wh-4',
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toContain('Timestamp');
  });

  it('rejects request with timestamp older than 5 minutes', async () => {
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const body = '{"id":"1"}';
    const oldTimestamp = new Date(Date.now() - 6 * 60 * 1000).toISOString();
    const req = makeRequest(body, {
      'X-Shopify-Hmac-Sha256': computeHmac(body),
      'X-Shopify-Topic': 'products/create',
      'X-Shopify-Webhook-Id': 'wh-5',
      'X-Shopify-Triggered-At': oldTimestamp,
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('accepts request with current timestamp', async () => {
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const body = '{"id":"1"}';
    const req = makeRequest(body, {
      'X-Shopify-Hmac-Sha256': computeHmac(body),
      'X-Shopify-Topic': 'products/create',
      'X-Shopify-Webhook-Id': 'wh-6',
      'X-Shopify-Triggered-At': new Date().toISOString(),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});

describe('Webhook idempotency', () => {
  it('returns already_processed for duplicate webhook ID', async () => {
    mockRedis.exists.mockResolvedValueOnce(1);
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const body = '{"id":"1"}';
    const req = makeRequest(body, {
      'X-Shopify-Hmac-Sha256': computeHmac(body),
      'X-Shopify-Topic': 'products/create',
      'X-Shopify-Webhook-Id': 'wh-duplicate',
      'X-Shopify-Triggered-At': new Date().toISOString(),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('already_processed');
  });

  it('stores webhook ID in Redis for new requests', async () => {
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const body = '{"id":"1"}';
    const req = makeRequest(body, {
      'X-Shopify-Hmac-Sha256': computeHmac(body),
      'X-Shopify-Topic': 'products/create',
      'X-Shopify-Webhook-Id': 'wh-new',
      'X-Shopify-Triggered-At': new Date().toISOString(),
    });
    await POST(req);
    expect(mockRedis.setex).toHaveBeenCalledWith(
      'webhook:idempotency:wh-new',
      86400,
      '1'
    );
  });
});

describe('Webhook topic routing', () => {
  it('calls revalidateProducts for products/create topic', async () => {
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const body = '{"id":"1"}';
    const req = makeRequest(body, {
      'X-Shopify-Hmac-Sha256': computeHmac(body),
      'X-Shopify-Topic': 'products/create',
      'X-Shopify-Webhook-Id': 'wh-prod',
      'X-Shopify-Triggered-At': new Date().toISOString(),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockRevalidateProducts).toHaveBeenCalled();
  });

  it('calls revalidateCollections for collections/update topic', async () => {
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const body = '{"id":"1"}';
    const req = makeRequest(body, {
      'X-Shopify-Hmac-Sha256': computeHmac(body),
      'X-Shopify-Topic': 'collections/update',
      'X-Shopify-Webhook-Id': 'wh-coll',
      'X-Shopify-Triggered-At': new Date().toISOString(),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockRevalidateCollections).toHaveBeenCalled();
  });

  it('calls revalidateAll for orders/create topic', async () => {
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const body = '{"id":"1"}';
    const req = makeRequest(body, {
      'X-Shopify-Hmac-Sha256': computeHmac(body),
      'X-Shopify-Topic': 'orders/create',
      'X-Shopify-Webhook-Id': 'wh-ord',
      'X-Shopify-Triggered-At': new Date().toISOString(),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockRevalidateAll).toHaveBeenCalled();
  });

  it('returns ok for unknown topic without crashing', async () => {
    const { POST } = await import('@/app/[locale]/api/webhooks/route');
    const body = '{"id":"1"}';
    const req = makeRequest(body, {
      'X-Shopify-Hmac-Sha256': computeHmac(body),
      'X-Shopify-Topic': 'unknown/topic',
      'X-Shopify-Webhook-Id': 'wh-unknown',
      'X-Shopify-Triggered-At': new Date().toISOString(),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('ok');
  });
});