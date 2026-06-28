import { describe, it, expect, beforeEach, vi } from 'vitest';

import { logAuditEvent, getUserAuditHistory, createDeletionRequest, getDeletionRequest, collectUserData } from '@/lib/compliance/audit';
import {
  recordConsent,
  getConsentState,
  getConsentHistory,
  verifyConsentLedger,
} from '@/lib/compliance/consent';

const { mockRedis } = vi.hoisted(() => {
  const chain = {
    rpush: vi.fn().mockReturnThis(),
    ltrim: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue([]),
  };
  return {
    mockRedis: {
      rpush: vi.fn().mockResolvedValue(1),
      set: vi.fn().mockResolvedValue('OK'),
      get: vi.fn().mockResolvedValue(null),
      setex: vi.fn().mockResolvedValue('OK'),
      lrange: vi.fn().mockResolvedValue([]),
      exists: vi.fn().mockResolvedValue(0),
      multi: vi.fn(() => chain),
    },
  };
});

vi.mock('@/lib/redis/client', () => ({
  getRedisClient: () => mockRedis,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockRedis.get.mockResolvedValue(null);
  mockRedis.lrange.mockResolvedValue([]);
});

describe('recordConsent', () => {
  it('records consent in Redis ledger', async () => {
    const record = await recordConsent('user-1', true, '1.0');
    expect(record.userId).toBe('user-1');
    expect(record.consent).toBe(true);
    expect(record.version).toBe('1.0');
    expect(record.id).toBeDefined();
    expect(record.timestamp).toBeDefined();
    expect(mockRedis.multi).toHaveBeenCalled();
  });

  it('records declined consent', async () => {
    const record = await recordConsent('user-2', false, '1.0');
    expect(record.consent).toBe(false);
  });

  it('includes IP and user agent when provided', async () => {
    const record = await recordConsent('user-3', true, '1.0', {
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
    });
    expect(record.ip).toBe('192.168.1.1');
    expect(record.userAgent).toBe('Mozilla/5.0');
  });

  it('generates unique record IDs', async () => {
    const r1 = await recordConsent('user-4', true, '1.0');
    const r2 = await recordConsent('user-4', true, '1.0');
    expect(r1.id).not.toBe(r2.id);
  });
});

describe('getConsentState', () => {
  it('returns null when no consent state exists', async () => {
    mockRedis.get.mockResolvedValue(null);
    const state = await getConsentState('user-no-state');
    expect(state).toBeNull();
  });

  it('returns consent record when state exists', async () => {
    const record = {
      id: 'rec-1',
      userId: 'user-5',
      consent: true,
      version: '1.0',
      timestamp: new Date().toISOString(),
    };
    mockRedis.get.mockResolvedValue(JSON.stringify(record));
    const state = await getConsentState('user-5');
    expect(state).not.toBeNull();
    expect(state?.userId).toBe('user-5');
    expect(state?.consent).toBe(true);
  });
});

describe('getConsentHistory', () => {
  it('returns empty array when no history', async () => {
    mockRedis.lrange.mockResolvedValue([]);
    const history = await getConsentHistory('user-no-history');
    expect(history).toEqual([]);
  });

  it('returns history records', async () => {
    const records = [
      JSON.stringify({ id: 'r1', userId: 'u1', consent: true, version: '1.0', timestamp: '2026-01-01T00:00:00Z' }),
      JSON.stringify({ id: 'r2', userId: 'u1', consent: false, version: '1.0', timestamp: '2026-01-02T00:00:00Z' }),
    ];
    mockRedis.lrange.mockResolvedValue(records);
    const history = await getConsentHistory('u1');
    expect(history).toHaveLength(2);
    expect(history[0]!.consent).toBe(true);
    expect(history[1]!.consent).toBe(false);
  });
});

describe('verifyConsentLedger', () => {
  it('returns valid when no records exist', async () => {
    mockRedis.get.mockResolvedValue(null);
    mockRedis.lrange.mockResolvedValue([]);
    const result = await verifyConsentLedger('user-empty');
    expect(result.valid).toBe(false);
    expect(result.recordCount).toBe(0);
  });

  it('returns valid with record count when history exists', async () => {
    const records = [
      JSON.stringify({ id: 'r1', userId: 'u1', consent: true, version: '1.0', timestamp: '2026-01-01T00:00:00Z' }),
    ];
    mockRedis.lrange.mockResolvedValue(records);
    mockRedis.get.mockResolvedValue(records[0]!);
    const result = await verifyConsentLedger('u1');
    expect(result.valid).toBe(true);
    expect(result.recordCount).toBe(1);
  });
});

describe('logAuditEvent', () => {
  it('logs an audit event to Redis', async () => {
    const event = await logAuditEvent('consent_recorded', 'user-a', { version: '1.0' });
    expect(event.type).toBe('consent_recorded');
    expect(event.userId).toBe('user-a');
    expect(event.id).toBeDefined();
    expect(mockRedis.multi).toHaveBeenCalled();
  });

  it('logs without details', async () => {
    const event = await logAuditEvent('login', 'user-b');
    expect(event.details).toBeUndefined();
  });

  it('includes IP when provided', async () => {
    const event = await logAuditEvent('logout', 'user-c', undefined, { ip: '10.0.0.1' });
    expect(event.ip).toBe('10.0.0.1');
  });
});

describe('getUserAuditHistory', () => {
  it('returns empty array when no history', async () => {
    mockRedis.lrange.mockResolvedValue([]);
    const history = await getUserAuditHistory('user-no-audit');
    expect(history).toEqual([]);
  });

  it('returns audit events', async () => {
    const events = [
      JSON.stringify({ id: 'e1', type: 'login', userId: 'u1', timestamp: '2026-01-01T00:00:00Z' }),
    ];
    mockRedis.lrange.mockResolvedValue(events);
    const history = await getUserAuditHistory('u1');
    expect(history).toHaveLength(1);
    expect(history[0]!.type).toBe('login');
  });
});

describe('createDeletionRequest', () => {
  it('creates a deletion request with a request ID', async () => {
    const requestId = await createDeletionRequest('user-del');
    expect(requestId).toBeDefined();
    expect(typeof requestId).toBe('string');
    expect(mockRedis.setex).toHaveBeenCalled();
  });

  it('logs audit event for deletion request', async () => {
    await createDeletionRequest('user-del-2');
    expect(mockRedis.multi).toHaveBeenCalled();
  });
});

describe('getDeletionRequest', () => {
  it('returns null when request does not exist', async () => {
    mockRedis.get.mockResolvedValue(null);
    const result = await getDeletionRequest('nonexistent');
    expect(result).toBeNull();
  });

  it('returns deletion request when it exists', async () => {
    const record = {
      userId: 'user-del-3',
      requestedAt: '2026-01-01T00:00:00Z',
      status: 'pending',
    };
    mockRedis.get.mockResolvedValue(JSON.stringify(record));
    const result = await getDeletionRequest('req-123');
    expect(result).not.toBeNull();
    expect(result?.userId).toBe('user-del-3');
    expect(result?.status).toBe('pending');
  });
});

describe('collectUserData', () => {
  it('collects consent state and audit history', async () => {
    mockRedis.get.mockResolvedValue(null);
    mockRedis.lrange.mockResolvedValue([]);
    const data = await collectUserData('user-export');
    expect(data.consent).toBeNull();
    expect(data.auditHistory).toEqual([]);
  });

  it('returns data with consent record when present', async () => {
    const consentRecord = {
      id: 'r1',
      userId: 'user-export-2',
      consent: true,
      version: '1.0',
      timestamp: '2026-01-01T00:00:00Z',
    };
    mockRedis.get.mockResolvedValue(JSON.stringify(consentRecord));
    mockRedis.lrange.mockResolvedValue([]);
    const data = await collectUserData('user-export-2');
    expect(data.consent).not.toBeNull();
    expect(data.consent?.consent).toBe(true);
  });
});
