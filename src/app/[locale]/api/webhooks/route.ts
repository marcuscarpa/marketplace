import { createHmac, timingSafeEqual } from 'crypto';

import { NextRequest, NextResponse } from 'next/server';

import { getEnv } from '@/lib/env';
import { getRedisClient } from '@/lib/redis/client';
import {
  revalidateProducts,
  revalidateCollections,
  revalidateCart,
  revalidateSearch,
  revalidateAll,
} from '@/lib/shopify/cache';

function getWebhookSecret(): string {
  try {
    return getEnv().SHOPIFY_WEBHOOK_SECRET;
  } catch {
    return process.env.SHOPIFY_WEBHOOK_SECRET ?? '';
  }
}

const IDEMPOTENCY_TTL = 86400;

const TOPIC_ROUTE_MAP: Record<string, () => void> = {
  'products/create': revalidateProducts,
  'products/update': revalidateProducts,
  'products/delete': revalidateProducts,
  'collections/create': revalidateCollections,
  'collections/update': revalidateCollections,
  'collections/delete': revalidateCollections,
  'carts/create': revalidateCart,
  'carts/update': revalidateCart,
  'carts/delete': revalidateCart,
  'customers/create': revalidateAll,
  'customers/update': revalidateAll,
  'customers/delete': revalidateAll,
  'orders/create': revalidateAll,
  'orders/updated': revalidateAll,
  'orders/cancelled': revalidateAll,
  'inventory/update': revalidateProducts,
};

function validateHmac(body: string, hmacHeader: string): boolean {
  const secret = getWebhookSecret();
  if (!secret) return false;
  const hmac = createHmac('sha256', secret);
  hmac.update(body, 'utf8');
  const computed = hmac.digest('base64');
  try {
    const a = Buffer.from(computed, 'base64');
    const b = Buffer.from(hmacHeader, 'base64');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function validateTimestamp(timestampHeader: string | null): boolean {
  if (!timestampHeader) return false;
  const timestamp = new Date(timestampHeader).getTime();
  if (isNaN(timestamp)) return false;
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return Math.abs(now - timestamp) <= fiveMinutes;
}

async function checkIdempotency(webhookId: string): Promise<boolean> {
  if (!webhookId) return false;
  const secret = getWebhookSecret();
  if (!secret) return false;
  const redis = getRedisClient();
  const key = `webhook:idempotency:${webhookId}`;
  const exists = await redis.exists(key);
  if (exists) return true;
  await redis.setex(key, IDEMPOTENCY_TTL, '1');
  return false;
}

export async function POST(req: NextRequest) {
  const hmacHeader = req.headers.get('X-Shopify-Hmac-Sha256') ?? '';
  const topicHeader = req.headers.get('X-Shopify-Topic') ?? '';
  const webhookId = req.headers.get('X-Shopify-Webhook-Id') ?? '';
  const triggeredAt = req.headers.get('X-Shopify-Triggered-At');

  if (!hmacHeader) {
    return NextResponse.json({ error: 'Missing HMAC header' }, { status: 401 });
  }

  const body = await req.text();

  if (!validateHmac(body, hmacHeader)) {
    return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 });
  }

  if (!validateTimestamp(triggeredAt)) {
    return NextResponse.json({ error: 'Timestamp outside acceptable window' }, { status: 401 });
  }

  if (webhookId && (await checkIdempotency(webhookId))) {
    return NextResponse.json({ status: 'already_processed' }, { status: 200 });
  }

  const revalidate = TOPIC_ROUTE_MAP[topicHeader];
  if (revalidate) {
    revalidate();
  }

  return NextResponse.json({ status: 'ok' }, { status: 200 });
}