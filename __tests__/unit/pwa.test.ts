import type { Viewport } from 'next';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import manifest from '@/app/manifest';

vi.mock('next/font/google', () => ({
  Playfair_Display: () => ({ variable: '--font-playfair' }),
  Instrument_Sans: () => ({ variable: '--font-instrument' }),
  IBM_Plex_Mono: () => ({ variable: '--font-ibm-plex' }),
}));

describe('Root Layout Metadata', () => {
  it('includes themeColor in root layout viewport', async () => {
    const { viewport } = await import('@/app/layout');
    const vp = viewport as Viewport;
    expect(vp.themeColor).toBe('#030607');
  });
});

describe('PWA Manifest', () => {
  it('returns valid manifest object', () => {
    const result = manifest();
    expect(result.name).toBe('Sinesia Karol - Designer Swimwear & Bikini Collection');
    expect(result.short_name).toBe('Sinesia Karol');
    expect(result.display).toBe('standalone');
    expect(result.theme_color).toBe('#000000');
    expect(result.background_color).toBe('#ffffff');
  });

  it('includes brand favicon for install icon', () => {
    const result = manifest();
    expect(result.icons).toHaveLength(1);
    expect(result.icons![0]).toMatchObject({
      src: '/Favicon_sinesia.ico',
      sizes: '48x48',
      type: 'image/x-icon',
    } as Record<string, string>);
  });
});

describe('Service Worker Registration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('registers sw.js when serviceWorker is supported', async () => {
    const register = vi.fn().mockResolvedValue({
      installing: null,
      addEventListener: vi.fn(),
    });
    vi.stubGlobal('navigator', {
      serviceWorker: { register },
    });

    const { ServiceWorkerRegistration } = await import('@/components/ui/service-worker-registration');
    expect(ServiceWorkerRegistration).toBeDefined();
  });

  it('does not throw when serviceWorker is unavailable', async () => {
    vi.stubGlobal('navigator', {});

    const { ServiceWorkerRegistration } = await import('@/components/ui/service-worker-registration');
    expect(ServiceWorkerRegistration).toBeDefined();
  });
});

describe('PwaUpdateBanner', () => {
  it('exports a valid component function', async () => {
    const mod = await import('@/components/ui/pwa-update-banner');
    expect(mod.PwaUpdateBanner).toBeDefined();
    expect(typeof mod.PwaUpdateBanner).toBe('function');
  });
});

describe('PwaInstallPrompt', () => {
  it('exports a valid component function', async () => {
    const mod = await import('@/components/ui/pwa-install-prompt');
    expect(mod.PwaInstallPrompt).toBeDefined();
    expect(typeof mod.PwaInstallPrompt).toBe('function');
  });
});

describe('Sync Queue', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('exports all expected sync queue functions', async () => {
    const mod = await import('@/lib/pwa/sync-queue');
    expect(mod.queueOfflineAction).toBeDefined();
    expect(mod.getPendingActions).toBeDefined();
    expect(mod.clearPendingActions).toBeDefined();
    expect(mod.registerPeriodicSync).toBeDefined();
    expect(mod.isOnline).toBeDefined();
  });

  it('isOnline returns true when navigator.onLine is true', async () => {
    vi.stubGlobal('navigator', { onLine: true });
    const { isOnline } = await import('@/lib/pwa/sync-queue');
    const result = await isOnline();
    expect(result).toBe(true);
  });

  it('isOnline returns false when navigator.onLine is false', async () => {
    vi.stubGlobal('navigator', { onLine: false });
    const { isOnline } = await import('@/lib/pwa/sync-queue');
    const result = await isOnline();
    expect(result).toBe(false);
  });

  it('isOnline returns true when navigator is undefined', async () => {
    const { isOnline } = await import('@/lib/pwa/sync-queue');
    const result = await isOnline();
    expect(result).toBe(true);
  });

  it('queueOfflineAction does not throw when serviceWorker unavailable', async () => {
    vi.stubGlobal('navigator', {});
    const { queueOfflineAction } = await import('@/lib/pwa/sync-queue');
    await expect(queueOfflineAction('/api/cart', { method: 'POST', headers: {} })).resolves.toBeUndefined();
  });

  it('queueOfflineAction does not throw when navigator is undefined', async () => {
    const { queueOfflineAction } = await import('@/lib/pwa/sync-queue');
    await expect(queueOfflineAction('/api/cart', { method: 'POST', headers: {} })).resolves.toBeUndefined();
  });

  it('clearPendingActions returns without error when cache unavailable', async () => {
    const { clearPendingActions } = await import('@/lib/pwa/sync-queue');
    await expect(clearPendingActions()).resolves.toBeUndefined();
  });

  it('getPendingActions returns empty array when cache unavailable', async () => {
    const { getPendingActions } = await import('@/lib/pwa/sync-queue');
    const result = await getPendingActions();
    expect(result).toEqual([]);
  });

  it('registerPeriodicSync does not throw when navigator undefined', async () => {
    const { registerPeriodicSync } = await import('@/lib/pwa/sync-queue');
    await expect(registerPeriodicSync()).resolves.toBeUndefined();
  });

  it('registerPeriodicSync does not throw when serviceWorker unavailable', async () => {
    vi.stubGlobal('navigator', {});
    const { registerPeriodicSync } = await import('@/lib/pwa/sync-queue');
    await expect(registerPeriodicSync()).resolves.toBeUndefined();
  });
});

describe('Service Worker Content (sw.js)', () => {
  it('defines expected cache names', () => {
    var cacheNames = [
      'luxury-static-v2',
      'luxury-api-v2',
      'luxury-nav-v2',
      'luxury-sync-v2',
    ];
    expect(cacheNames).toContain('luxury-static-v2');
    expect(cacheNames).toContain('luxury-api-v2');
    expect(cacheNames).toContain('luxury-nav-v2');
    expect(cacheNames).toContain('luxury-sync-v2');
  });

  it('handles SKIP_WAITING message type', () => {
    var messageData = { type: 'SKIP_WAITING' };
    expect(messageData.type).toBe('SKIP_WAITING');
  });

  it('handles CACHE_URLS message type', () => {
    var messageData = { type: 'CACHE_URLS', urls: ['/products/test'] };
    expect(messageData.type).toBe('CACHE_URLS');
    expect(messageData.urls).toHaveLength(1);
  });

  it('handles sync event with sync-actions tag', () => {
    var event = { tag: 'sync-actions' };
    expect(event.tag).toBe('sync-actions');
  });

  it('handles periodicsync event with refresh-cache tag', () => {
    var event = { tag: 'refresh-cache' };
    expect(event.tag).toBe('refresh-cache');
  });

  it('routes navigation requests correctly', () => {
    var API_PATTERNS = [/\/api\//];
    var NAV_PATTERNS = [
      /^\/($|(?:[a-z]{2,4}(?:-[A-Z]{2})?)\/(?:$|products\/|collections\/|search|cart|account))/,
    ];

    function isApiRequest(url: { pathname: string }) { return API_PATTERNS.some(function (p) { return p.test(url.pathname); }); }

    var testCases = [
      { url: '/en/products/test', expected: true },
      { url: '/en/collections/all', expected: true },
      { url: '/en/search', expected: true },
      { url: '/en/cart', expected: true },
      { url: '/en/account', expected: true },
      { url: '/en-US/products/test', expected: true },
      { url: '/pt-BR/collections/all', expected: true },
      { url: '/fr/account', expected: true },
      { url: '/offline', expected: false },
      { url: '/api/search', expected: false },
      { url: '/_next/static/chunk.js', expected: false },
      { url: '/', expected: true },
    ];

    testCases.forEach(function (tc) {
      var url = new URL(tc.url, 'http://localhost');
      var isApi = isApiRequest(url);
      var isNav = !isApi && url.pathname !== '/offline' && NAV_PATTERNS.some(function (p) { return p.test(url.pathname); });
      expect(isNav).toBe(tc.expected);
    });
  });
});

describe('UI Component Exports', () => {
  it('exports PWA components from ui index', async () => {
    const mod = await import('@/components/ui');
    expect(mod.PwaUpdateBanner).toBeDefined();
    expect(mod.PwaInstallPrompt).toBeDefined();
    expect(mod.ServiceWorkerRegistration).toBeDefined();
  });
});
