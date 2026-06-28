import { describe, it, expect } from 'vitest';

describe('Auth Refresh', () => {
  it('exports refresh route handler', async () => {
    const mod = await import('@/app/[locale]/api/auth/refresh/route');
    expect(mod.POST).toBeDefined();
  });
});
