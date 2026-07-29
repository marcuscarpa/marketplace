import { describe, expect, it } from 'vitest';

import { isAccessTokenExpired } from '@/lib/auth/access-token';

describe('isAccessTokenExpired', () => {
  it('returns true for expired JWT exp claim', () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 60 })).toString(
      'base64url',
    );
    const token = `${header}.${payload}.sig`;

    expect(isAccessTokenExpired(token)).toBe(true);
  });

  it('returns false for valid JWT exp claim', () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString(
      'base64url',
    );
    const token = `${header}.${payload}.sig`;

    expect(isAccessTokenExpired(token)).toBe(false);
  });
});
