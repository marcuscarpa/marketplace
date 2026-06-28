import { revalidateTag } from 'next/cache';

import { getRedisClient } from '@/lib/redis/client';

const PUB_SUB_CHANNEL = process.env.REDIS_PUBSUB_CHANNEL ?? 'cache:invalidate';
const PUBSUB_LIST_KEY = `pubsub:${PUB_SUB_CHANNEL}`;
const MAX_LEDGER_SIZE = 1000;

export function revalidateProducts(): void {
  revalidateTag('products');
  void publishInvalidation({ type: 'products' });
}

export function revalidateCollections(): void {
  revalidateTag('collections');
  void publishInvalidation({ type: 'collections' });
}

export function revalidateCart(): void {
  revalidateTag('cart');
  void publishInvalidation({ type: 'cart' });
}

export function revalidateSearch(): void {
  revalidateTag('search');
  void publishInvalidation({ type: 'search' });
}

export function revalidateAll(): void {
  revalidateProducts();
  revalidateCollections();
  revalidateSearch();
}

interface InvalidationPayload {
  type: 'products' | 'collections' | 'cart' | 'search';
  shop?: string;
  timestamp: number;
}

async function publishInvalidation(payload: Omit<InvalidationPayload, 'timestamp'>): Promise<void> {
  try {
    const redis = getRedisClient();
    const json = JSON.stringify({ ...payload, timestamp: Date.now() });
    await redis.lpush(PUBSUB_LIST_KEY, json);
    await redis.ltrim(PUBSUB_LIST_KEY, 0, MAX_LEDGER_SIZE - 1);
  } catch {
    // Pub/Sub unavailable, revalidation via revalidateTag still works
  }
}

export async function subscribeToInvalidations(
  onMessage: (payload: InvalidationPayload) => void
): Promise<() => void> {
  const redis = getRedisClient();

  // ponytail: subscribe to the same list key that publishInvalidation writes to.
  // Using polling with lrange+ltrim (not redis.subscribe) since Edge Runtime
  // doesn't support pub/sub subscriptions.
  const lastSeenKey = `pubsub:lastseen:${PUB_SUB_CHANNEL}`;

  const interval = setInterval(async () => {
    try {
      const messages = await redis.lrange(PUBSUB_LIST_KEY, 0, -1);
      const lastSeenRaw = await redis.get(lastSeenKey);
      const lastSeen = lastSeenRaw ? parseInt(lastSeenRaw, 10) : 0;
      let newLastSeen = lastSeen;

      for (let i = 0; i < messages.length; i++) {
        if (i <= lastSeen) continue;
        const raw = messages[i];
        if (!raw) continue;
        try {
          const payload = JSON.parse(raw) as InvalidationPayload;
          onMessage(payload);
        } catch {
          // Ignore malformed messages
        }
        newLastSeen = Math.max(newLastSeen, i);
      }

      if (newLastSeen > lastSeen) {
        await redis.set(lastSeenKey, String(newLastSeen));
      }
    } catch {
      // Ignore polling errors
    }
  }, 5000);

  return () => clearInterval(interval);
}