import { describe, it, expect } from 'vitest';

describe('Feature Flags', () => {
  it('exports flag evaluation functions', async () => {
    const mod = await import('@/lib/feature-flags');
    expect(mod.getBooleanFlag).toBeDefined();
    expect(mod.isFeatureFlagsInitialized).toBeDefined();
    expect(mod.FLAG_KEYS).toBeDefined();
  });
});
