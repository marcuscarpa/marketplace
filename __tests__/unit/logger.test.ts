import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Logger', () => {
  it('exports logger with expected methods', async () => {
    const { logger } = await import('@/lib/logger');
    expect(logger.info).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });
});
