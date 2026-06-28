import { getRedisClient } from '@/lib/redis/client';

interface Lock {
  release(): Promise<void>;
}

interface RedlockInstance {
  acquire(keys: string[], duration: number): Promise<Lock>;
}

type RedlockConstructor = new (
  clients: unknown[],
  options: { retryCount?: number; retryDelay?: number; retryJitter?: number }
) => RedlockInstance;

let redlockInstance: RedlockInstance | null = null;

export function getRedlockInstance(): RedlockInstance {
  if (!redlockInstance) {
    const redis = getRedisClient();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Redlock = require('redlock') as RedlockConstructor;
    redlockInstance = new Redlock([redis], {
      retryCount: 5,
      retryDelay: 200,
      retryJitter: 100,
    });
  }
  return redlockInstance;
}

export async function withLock<T>(key: string, fn: () => Promise<T>, ttl = 5000): Promise<T> {
  const redlock = getRedlockInstance();
  const lock = await redlock.acquire([`lock:${key}`], ttl);
  try {
    return await fn();
  } finally {
    await lock.release();
  }
}