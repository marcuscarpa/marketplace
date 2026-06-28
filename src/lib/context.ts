import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

export interface RequestContext {
  requestId: string;
  traceId?: string;
  spanId?: string;
  locale?: string;
  userId?: string;
  method?: string;
  path?: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export function getRequestContext(): RequestContext | undefined {
  return asyncLocalStorage.getStore();
}

export function getRequestId(): string | undefined {
  return asyncLocalStorage.getStore()?.requestId;
}

export function runWithContext<T>(
  context: RequestContext,
  fn: () => T
): T {
  return asyncLocalStorage.run(context, fn);
}

export function runWithAsyncContext<T>(
  context: RequestContext,
  fn: () => Promise<T>
): Promise<T> {
  return asyncLocalStorage.run(context, fn);
}

export function createRequestContext(overrides?: Partial<RequestContext>): RequestContext {
  return {
    requestId: overrides?.requestId ?? randomUUID(),
    ...overrides,
  };
}

export function updateRequestContext(updates: Partial<RequestContext>): RequestContext {
  const current = asyncLocalStorage.getStore();
  if (!current) {
    return createRequestContext(updates);
  }
  Object.assign(current, updates);
  return current;
}
