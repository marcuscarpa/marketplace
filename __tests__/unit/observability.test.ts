import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createRequestContext,
  getRequestContext,
  getRequestId,
  runWithContext,
  updateRequestContext,
} from '@/lib/context';
import { buildEntry, logger } from '@/lib/logger';
import { captureException, captureMessage, clearUser, isSentryAvailable, setUser } from '@/lib/sentry';

describe('createRequestContext', () => {
  it('creates context with a generated requestId', () => {
    const ctx = createRequestContext();
    expect(ctx.requestId).toBeDefined();
    expect(typeof ctx.requestId).toBe('string');
    expect(ctx.requestId.length).toBeGreaterThan(0);
  });

  it('creates context with provided overrides', () => {
    const ctx = createRequestContext({
      locale: 'pt',
      userId: 'user-123',
      traceId: 'trace-abc',
    });
    expect(ctx.locale).toBe('pt');
    expect(ctx.userId).toBe('user-123');
    expect(ctx.traceId).toBe('trace-abc');
  });

  it('generates unique request IDs', () => {
    const ctx1 = createRequestContext();
    const ctx2 = createRequestContext();
    expect(ctx1.requestId).not.toBe(ctx2.requestId);
  });

  it('allows overriding requestId', () => {
    const ctx = createRequestContext({ requestId: 'custom-id' });
    expect(ctx.requestId).toBe('custom-id');
  });
});

describe('runWithContext', () => {
  it('sets context within the callback', () => {
    const ctx = createRequestContext({ requestId: 'test-1' });
    runWithContext(ctx, () => {
      const stored = getRequestContext();
      expect(stored?.requestId).toBe('test-1');
    });
  });

  it('clears context after the callback', () => {
    const ctx = createRequestContext({ requestId: 'test-2' });
    runWithContext(ctx, () => {
      expect(getRequestContext()?.requestId).toBe('test-2');
    });
    expect(getRequestContext()).toBeUndefined();
  });

  it('returns the callback result', () => {
    const ctx = createRequestContext();
    const result = runWithContext(ctx, () => 42);
    expect(result).toBe(42);
  });

  it('preserves async context', async () => {
    const ctx = createRequestContext({ requestId: 'async-test' });
    await runWithContext(ctx, async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(getRequestContext()?.requestId).toBe('async-test');
    });
  });
});

describe('getRequestId', () => {
  it('returns undefined outside of context', () => {
    expect(getRequestId()).toBeUndefined();
  });

  it('returns requestId within context', () => {
    const ctx = createRequestContext({ requestId: 'rid-123' });
    runWithContext(ctx, () => {
      expect(getRequestId()).toBe('rid-123');
    });
  });
});

describe('updateRequestContext', () => {
  it('updates context within an existing run', () => {
    const ctx = createRequestContext({ requestId: 'orig', locale: 'en' });
    runWithContext(ctx, () => {
      updateRequestContext({ userId: 'user-456' });
      const stored = getRequestContext();
      expect(stored?.requestId).toBe('orig');
      expect(stored?.userId).toBe('user-456');
      expect(stored?.locale).toBe('en');
    });
  });

  it('creates new context when no existing context', () => {
    const updated = updateRequestContext({ locale: 'pt' });
    expect(updated.locale).toBe('pt');
    expect(updated.requestId).toBeDefined();
  });
});

describe('logger', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('logs info messages as JSON to stdout', () => {
    logger.info('Test message', { key: 'value' });
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls[0]?.[0] as string;
    const parsed = JSON.parse(output);
    expect(parsed.level).toBe('info');
    expect(parsed.message).toBe('Test message');
    expect(parsed.key).toBe('value');
    expect(parsed.timestamp).toBeDefined();
  });

  it('logs error messages to stderr', () => {
    logger.error('Error occurred', { code: 500 });
    expect(errorSpy).toHaveBeenCalled();
    const output = errorSpy.mock.calls[0]?.[0] as string;
    const parsed = JSON.parse(output);
    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('Error occurred');
    expect(parsed.code).toBe(500);
  });

  it('includes requestId from context', () => {
    const ctx = createRequestContext({ requestId: 'log-test-id' });
    runWithContext(ctx, () => {
      logger.info('With context');
    });
    const output = logSpy.mock.calls.map((c) => c[0] as string).find((s) => s.includes('With context'));
    expect(output).toBeDefined();
    const parsed = JSON.parse(output as string);
    expect(parsed.requestId).toBe('log-test-id');
  });

  it('includes traceId and spanId from context', () => {
    const ctx = createRequestContext({
      requestId: 'log-trace-id',
      traceId: 'trace-xyz',
      spanId: 'span-abc',
    });
    runWithContext(ctx, () => {
      logger.info('With trace');
    });
    const output = logSpy.mock.calls.map((c) => c[0] as string).find((s) => s.includes('With trace'));
    const parsed = JSON.parse(output as string);
    expect(parsed.traceId).toBe('trace-xyz');
    expect(parsed.spanId).toBe('span-abc');
  });

  it('includes userId from context', () => {
    const ctx = createRequestContext({ requestId: 'log-user-id', userId: 'user-789' });
    runWithContext(ctx, () => {
      logger.info('With user');
    });
    const output = logSpy.mock.calls.map((c) => c[0] as string).find((s) => s.includes('With user'));
    const parsed = JSON.parse(output as string);
    expect(parsed.userId).toBe('user-789');
  });

  it('creates child logger with extra context', () => {
    const child = logger.child({ locale: 'en' } as Partial<import('@/lib/context').RequestContext>);
    child.info('Child message');
    const output = logSpy.mock.calls.map((c) => c[0] as string).find((s) => s.includes('Child message'));
    const parsed = JSON.parse(output as string);
    expect(parsed.locale).toBe('en');
  });

  it('logs warn level messages', () => {
    logger.warn('Warning message');
    const output = logSpy.mock.calls.map((c) => c[0] as string).find((s) => s.includes('Warning message'));
    const parsed = JSON.parse(output as string);
    expect(parsed.level).toBe('warn');
  });

  it('logs fatal level messages to stderr', () => {
    logger.fatal('Fatal error');
    expect(errorSpy).toHaveBeenCalled();
    const output = errorSpy.mock.calls[0]?.[0] as string;
    const parsed = JSON.parse(output);
    expect(parsed.level).toBe('fatal');
  });

  it('produces valid JSON output', () => {
    logger.info('JSON test', { nested: { value: 1 } });
    const output = logSpy.mock.calls[0]?.[0] as string;
    expect(() => JSON.parse(output)).not.toThrow();
    const parsed = JSON.parse(output);
    expect(parsed.nested.value).toBe(1);
  });

  it('debug messages are logged when LOG_LEVEL allows', () => {
    const origLevel = process.env.LOG_LEVEL;
    process.env.LOG_LEVEL = 'debug';
    logger.debug('Debug test');
    const output = logSpy.mock.calls.map((c) => c[0] as string).find((s) => s.includes('Debug test'));
    expect(output).toBeDefined();
    process.env.LOG_LEVEL = origLevel;
  });
});

describe('buildEntry', () => {
  it('builds a log entry without context', () => {
    const entry = buildEntry('info', 'test message', { custom: 'field' });
    expect(entry.level).toBe('info');
    expect(entry.message).toBe('test message');
    expect(entry.custom).toBe('field');
    expect(entry.timestamp).toBeDefined();
  });

  it('includes context fields when available', () => {
    const ctx = createRequestContext({ requestId: 'build-test', traceId: 't1' });
    runWithContext(ctx, () => {
      const entry = buildEntry('error', 'ctx msg');
      expect(entry.requestId).toBe('build-test');
      expect(entry.traceId).toBe('t1');
    });
  });
});

describe('sentry wrapper', () => {
  it('isSentryAvailable returns boolean', () => {
    expect(typeof isSentryAvailable()).toBe('boolean');
  });

  it('captureException does not throw without Sentry', () => {
    expect(() => captureException(new Error('test'))).not.toThrow();
  });

  it('captureMessage does not throw without Sentry', () => {
    expect(() => captureMessage('test message')).not.toThrow();
  });

  it('captureException includes context in log', () => {
    const errorSpyLocal = vi.spyOn(console, 'error').mockImplementation(() => {});
    const ctx = createRequestContext({ requestId: 'sentry-test' });
    runWithContext(ctx, () => {
      captureException(new Error('captured error'));
    });
    const allOutput = errorSpyLocal.mock.calls.map((c) => c[0] as string).join('');
    expect(allOutput).toContain('captured error');
    expect(allOutput).toContain('sentry-test');
    errorSpyLocal.mockRestore();
  });

  it('setUser does not throw without Sentry', () => {
    expect(() => setUser('user-1', 'test@test.com')).not.toThrow();
    expect(() => clearUser()).not.toThrow();
  });
});
