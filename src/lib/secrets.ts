import { createHash, randomBytes } from 'crypto';

import { getRedisClient } from '@/lib/redis/client';
import { logger } from '@/lib/logger';

function hashSecret(key: string, value: string): string {
  return createHash('sha256').update(`${key}:${value}`).digest('hex');
}

const CACHE_SALT = process.env.SECRETS_CACHE_SALT || randomBytes(32).toString('hex');

function encryptValue(value: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(value);
  const keyBytes = encoder.encode(CACHE_SALT);
  const encrypted = Buffer.alloc(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    encrypted[i] = (bytes[i] ?? 0) ^ (keyBytes[i % keyBytes.length] ?? 0);
  }
  return encrypted.toString('base64');
}

function decryptValue(encrypted: string): string {
  const encoder = new TextEncoder();
  const bytes = Buffer.from(encrypted, 'base64');
  const keyBytes = encoder.encode(CACHE_SALT);
  const decrypted = Buffer.alloc(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    decrypted[i] = (bytes[i] ?? 0) ^ (keyBytes[i % keyBytes.length] ?? 0);
  }
  return new TextDecoder().decode(decrypted);
}

export async function getSecret(key: string): Promise<string | null> {
  try {
    const value = process.env[key] ?? null;
    if (!value) return null;

    const redis = getRedisClient();
    const cacheKey = `secret:${key}`;
    const integrityKey = `secret:integrity:${key}`;
    const cached = await redis.get(cacheKey);
    const cachedHash = await redis.get(integrityKey);

    if (cached && cachedHash) {
      const decrypted = decryptValue(cached);
      const expectedHash = hashSecret(key, decrypted);
      if (cachedHash === expectedHash) {
        return decrypted;
      }
      logger.warn('Secret cache integrity check failed, re-caching', { key });
    }

    const encrypted = encryptValue(value);
    const hash = hashSecret(key, value);
    await Promise.all([
      redis.set(cacheKey, encrypted, 'EX', 300),
      redis.set(integrityKey, hash, 'EX', 300),
    ]);
    return value;
  } catch (error) {
    logger.error('Failed to fetch secret, falling back to env', { key, error });
    return process.env[key] ?? null;
  }
}

export async function invalidateSecret(key: string): Promise<void> {
  try {
    const redis = getRedisClient();
    await Promise.all([
      redis.del(`secret:${key}`),
      redis.del(`secret:integrity:${key}`),
    ]);
  } catch (error) {
    logger.warn('Failed to invalidate secret cache', { key, error });
  }
}