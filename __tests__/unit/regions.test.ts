import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';

import { resolveRegion, getRegion } from '@/lib/regions';

describe('resolveRegion', () => {
  it('returns BR region when cookie is set to br', () => {
    const request = {
      cookies: { get: (name: string) => (name === 'region' ? { value: 'br' } : undefined) },
      headers: { get: () => null },
    } as unknown as NextRequest;
    const region = resolveRegion(request);
    expect(region.code).toBe('BR');
    expect(region.currency).toBe('BRL');
  });

  it('returns US region when cookie is set to us', () => {
    const request = {
      cookies: { get: (name: string) => (name === 'region' ? { value: 'us' } : undefined) },
      headers: { get: () => null },
    } as unknown as NextRequest;
    const region = resolveRegion(request);
    expect(region.code).toBe('US');
    expect(region.currency).toBe('USD');
  });

  it('falls back to US when no region indicators', () => {
    const request = {
      cookies: { get: () => undefined },
      headers: { get: () => null },
    } as unknown as NextRequest;
    const region = resolveRegion(request);
    expect(region.code).toBe('US');
  });

  it('getRegion returns US for unknown code', () => {
    const region = getRegion('unknown');
    expect(region.code).toBe('US');
  });
});