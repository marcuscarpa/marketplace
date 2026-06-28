import { randomUUID } from 'crypto';

import { getConsentState, type ConsentRecord } from '@/lib/compliance/consent';
import { logger } from '@/lib/logger';
import { getRedisClient } from '@/lib/redis/client';

export type AuditEventType =
  | 'consent_recorded'
  | 'consent_declined'
  | 'data_exported'
  | 'deletion_requested'
  | 'deletion_completed'
  | 'login'
  | 'logout';

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  userId: string;
  timestamp: string;
  details?: Record<string, unknown>;
  ip?: string;
}

const AUDIT_PREFIX = 'audit:log';
const USER_AUDIT_PREFIX = 'audit:user';
const MAX_AUDIT_SIZE = 1000;

export async function logAuditEvent(
  type: AuditEventType,
  userId: string,
  details?: Record<string, unknown>,
  metadata?: { ip?: string }
): Promise<AuditEvent> {
  const redis = getRedisClient();
  const event: AuditEvent = {
    id: randomUUID(),
    type,
    userId,
    timestamp: new Date().toISOString(),
    details,
    ip: metadata?.ip,
  };

  try {
    const globalKey = `${AUDIT_PREFIX}:${event.timestamp.split('T')[0]}`;
    const userKey = `${USER_AUDIT_PREFIX}:${userId}`;
    const json = JSON.stringify(event);
    await redis
      .multi()
      .rpush(globalKey, json)
      .ltrim(globalKey, -MAX_AUDIT_SIZE, -1)
      .rpush(userKey, json)
      .ltrim(userKey, -MAX_AUDIT_SIZE, -1)
      .exec();
    logger.info('Audit event logged', {
      eventType: type,
      userId,
      eventId: event.id,
    });
  } catch (error) {
    logger.error('Failed to log audit event', {
      eventType: type,
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return event;
}

export async function getUserAuditHistory(userId: string): Promise<AuditEvent[]> {
  const redis = getRedisClient();
  try {
    const records = await redis.lrange(`${USER_AUDIT_PREFIX}:${userId}`, 0, -1);
    return records.map((r) => JSON.parse(r) as AuditEvent);
  } catch {
    return [];
  }
}

export async function getDeletionRequest(requestId: string): Promise<{
  userId: string;
  requestedAt: string;
  status: 'pending' | 'completed';
} | null> {
  const redis = getRedisClient();
  try {
    const data = await redis.get(`compliance:deletion:${requestId}`);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function createDeletionRequest(userId: string): Promise<string> {
  const redis = getRedisClient();
  const requestId = randomUUID();
  const record = {
    userId,
    requestedAt: new Date().toISOString(),
    status: 'pending' as const,
  };

  try {
    await redis.setex(
      `compliance:deletion:${requestId}`,
      30 * 24 * 60 * 60,
      JSON.stringify(record)
    );
    await logAuditEvent('deletion_requested', userId, { requestId });
    logger.info('Deletion request created', { userId, requestId });
  } catch (error) {
    logger.error('Failed to create deletion request', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  return requestId;
}

export async function collectUserData(userId: string): Promise<{
  consent: ConsentRecord | null;
  auditHistory: AuditEvent[];
}> {
  const [consent, auditHistory] = await Promise.all([
    getConsentState(userId),
    getUserAuditHistory(userId),
  ]);

  return { consent, auditHistory };
}
