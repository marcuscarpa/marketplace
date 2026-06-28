import { randomUUID } from 'crypto';

import { logger } from '@/lib/logger';
import { getRedisClient } from '@/lib/redis/client';

export interface ConsentRecord {
  id: string;
  userId: string;
  consent: boolean;
  version: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

const LEDGER_PREFIX = 'consent:ledger';
const CONSENT_STATE_PREFIX = 'consent:state';
const DELETION_QUEUE_PREFIX = 'compliance:deletion';
const DELETION_TTL = 30 * 24 * 60 * 60;
const MAX_LEDGER_SIZE = 100;

export async function recordConsent(
  userId: string,
  consent: boolean,
  version: string,
  metadata?: { ip?: string; userAgent?: string }
): Promise<ConsentRecord> {
  const redis = getRedisClient();
  const record: ConsentRecord = {
    id: randomUUID(),
    userId,
    consent,
    version,
    timestamp: new Date().toISOString(),
    ip: metadata?.ip,
    userAgent: metadata?.userAgent,
  };

  const ledgerKey = `${LEDGER_PREFIX}:${userId}`;
  const stateKey = `${CONSENT_STATE_PREFIX}:${userId}`;

  try {
    await redis
      .multi()
      .rpush(ledgerKey, JSON.stringify(record))
      .ltrim(ledgerKey, -MAX_LEDGER_SIZE, -1)
      .set(stateKey, JSON.stringify(record))
      .exec();
    logger.info('Consent recorded', { userId, consent, version, recordId: record.id });
  } catch (error) {
    logger.error('Failed to record consent', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  return record;
}

export async function getConsentState(userId: string): Promise<ConsentRecord | null> {
  const redis = getRedisClient();
  try {
    const state = await redis.get(`${CONSENT_STATE_PREFIX}:${userId}`);
    if (!state) return null;
    return JSON.parse(state) as ConsentRecord;
  } catch {
    return null;
  }
}

export async function getConsentHistory(userId: string): Promise<ConsentRecord[]> {
  const redis = getRedisClient();
  try {
    const records = await redis.lrange(`${LEDGER_PREFIX}:${userId}`, 0, -1);
    return records.map((r) => JSON.parse(r) as ConsentRecord);
  } catch {
    return [];
  }
}

export async function verifyConsentLedger(userId: string): Promise<{
  valid: boolean;
  recordCount: number;
}> {
  const history = await getConsentHistory(userId);
  const state = await getConsentState(userId);

  if (history.length === 0) {
    return { valid: false, recordCount: 0 };
  }

  const lastRecord = history[history.length - 1];
  const valid = Boolean(state && lastRecord && state.id === lastRecord.id);

  return { valid, recordCount: history.length };
}
