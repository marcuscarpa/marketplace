import { getRedisClient } from '@/lib/redis/client';

interface Lock {
  release(): Promise<void>;
}

interface RedlockModule {
  acquire(keys: string[], duration: number): Promise<Lock>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (clients: any[], options: { retryCount?: number; retryDelay?: number; retryJitter?: number }): RedlockModule;
}

let redlockInstance: RedlockModule | null = null;

export function getRedlockInstance(): RedlockModule {
  if (!redlockInstance) {
    const redis = getRedisClient();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Redlock = require('redlock') as RedlockModule;
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