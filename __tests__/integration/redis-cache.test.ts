import { describe, it, expect } from 'vitest';

describe('Redis Cache', () => {
  it('exports getRedisClient', async () => {
    const mod = await import('@/lib/redis/client');
    expect(mod.getRedisClient).toBeDefined();
  });

  it('exports lock helpers', async () => {
    const mod = await import('@/lib/cache/lock');
    expect(mod.withLock).toBeDefined();
  });

  it('exports stampede protection', async () => {
    const mod = await import('@/lib/cache/stampede');
    expect(mod.getCachedOrFetch).toBeDefined();
  });
});
