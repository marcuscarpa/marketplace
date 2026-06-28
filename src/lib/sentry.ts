import { getRequestContext } from '@/lib/context';
import { logger } from '@/lib/logger';

interface SentryCaptureContext {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  level?: 'info' | 'warning' | 'error' | 'fatal';
}

 
let sentryAvailable = false;
 
let sentryModule: typeof import('@sentry/nextjs') | null = null;

try {
  // Lazy dynamic import to avoid hard dependency at build time
  // (the module may be uninstalled in some environments).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  sentryModule = require('@sentry/nextjs');
  sentryAvailable = !!sentryModule?.captureException;
} catch {
  sentryAvailable = false;
}

export function isSentryAvailable(): boolean {
  return sentryAvailable;
}

export function captureException(
  error: Error | unknown,
  context?: SentryCaptureContext
): void {
  const ctx = getRequestContext();
  const tags = { ...context?.tags };
  const extra: Record<string, unknown> = { ...context?.extra };

  if (ctx?.requestId) extra.requestId = ctx.requestId;
  if (ctx?.traceId) extra.traceId = ctx.traceId;
  if (ctx?.userId) tags.userId = ctx.userId;
  if (ctx?.locale) tags.locale = ctx.locale;

  if (sentryAvailable && sentryModule?.captureException) {
    sentryModule.captureException(error, {
      tags: Object.keys(tags).length > 0 ? tags : undefined,
      extra: Object.keys(extra).length > 0 ? extra : undefined,
      level: context?.level,
    });
  }

  logger.error('Exception captured', {
    error: error instanceof Error ? error.message : String(error),
    ...extra,
    ...tags,
  });
}

export function captureMessage(
  message: string,
  context?: SentryCaptureContext
): void {
  const ctx = getRequestContext();
  const tags = { ...context?.tags };
  const extra: Record<string, unknown> = { ...context?.extra };

  if (ctx?.requestId) extra.requestId = ctx.requestId;
  if (ctx?.traceId) extra.traceId = ctx.traceId;

  if (sentryAvailable && sentryModule?.captureMessage) {
    sentryModule.captureMessage(message, {
      tags: Object.keys(tags).length > 0 ? tags : undefined,
      extra: Object.keys(extra).length > 0 ? extra : undefined,
      level: context?.level,
    });
  }

  logger.warn(message, { ...extra, ...tags });
}

export function setUser(userId: string, email?: string): void {
  if (sentryAvailable && sentryModule?.setUser) {
    sentryModule.setUser({ id: userId, email });
  }
}

export function clearUser(): void {
  if (sentryAvailable && sentryModule?.setUser) {
    sentryModule.setUser(null);
  }
}
