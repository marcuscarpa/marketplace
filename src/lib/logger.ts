import { getRequestContext, type RequestContext } from '@/lib/context';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

const MIN_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  requestId?: string;
  traceId?: string;
  spanId?: string;
  userId?: string;
  [key: string]: unknown;
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[MIN_LEVEL];
}

function buildEntry(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
): LogEntry {
  const ctx = getRequestContext();
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    requestId: ctx?.requestId,
    traceId: ctx?.traceId,
    spanId: ctx?.spanId,
    userId: ctx?.userId,
  };

  if (meta) {
    for (const [key, value] of Object.entries(meta)) {
      if (value !== undefined) {
        entry[key] = value;
      }
    }
  }

  return entry;
}

function output(entry: LogEntry): void {
  const json = JSON.stringify(entry);
  if (entry.level === 'error' || entry.level === 'fatal') {
    console.error(json);
  } else {
    console.log(json);
  }
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  if (!shouldLog(level)) return;
  output(buildEntry(level, message, meta));
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
  fatal: (message: string, meta?: Record<string, unknown>) => log('fatal', message, meta),
  child: (context: Partial<RequestContext>) => createChildLogger(context),
};

function createChildLogger(context: Partial<RequestContext>): {
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  fatal: (message: string, meta?: Record<string, unknown>) => void;
} {
  return {
    debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, { ...context, ...meta }),
    info: (message: string, meta?: Record<string, unknown>) => log('info', message, { ...context, ...meta }),
    warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, { ...context, ...meta }),
    error: (message: string, meta?: Record<string, unknown>) => log('error', message, { ...context, ...meta }),
    fatal: (message: string, meta?: Record<string, unknown>) => log('fatal', message, { ...context, ...meta }),
  };
}

export { buildEntry };
