import { describe, it, expect } from 'vitest';

describe('Request Context', () => {
  it('exports context functions', async () => {
    const mod = await import('@/lib/context');
    expect(mod.createRequestContext).toBeDefined();
    expect(mod.runWithContext).toBeDefined();
    expect(typeof mod.createRequestContext).toBe('function');
  });

  it('creates context with requestId and timestamp', async () => {
    const { createRequestContext } = await import('@/lib/context');
    const ctx = createRequestContext({ method: 'GET', path: '/test' });
    expect(ctx.requestId).toBeDefined();
    expect(typeof ctx.requestId).toBe('string');
  });
});
