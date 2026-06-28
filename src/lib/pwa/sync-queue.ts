'use client';

interface QueuedAction {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export async function isOnline(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;
  if ('onLine' in navigator) return navigator.onLine;
  return true;
}

export async function registerPeriodicSync(): Promise<void> {
  if (typeof navigator === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const swReg = reg as unknown as ServiceWorkerRegistration & { periodicSync?: { register: (tag: string, opts: { minInterval: number }) => Promise<void> } };
    if (swReg.periodicSync) {
      const status = await navigator.permissions.query({ name: 'periodic-background-sync' as PermissionName });
      if (status.state === 'granted') {
        await swReg.periodicSync.register('refresh-cache', { minInterval: 24 * 60 * 60 * 1000 });
      }
    }
  } catch {
  }
}

export async function queueOfflineAction(url: string, options: RequestInit & { headers: Record<string, string> }): Promise<void> {
  if (typeof navigator === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    if (reg.active) {
      reg.active.postMessage({
        type: 'CACHE_URLS',
        urls: [],
      });
    }
    const bodyStr = typeof options.body === 'string' ? options.body : undefined;
    const action: QueuedAction = {
      url,
      method: options.method || 'GET',
      headers: options.headers || {},
      body: bodyStr,
    };
    const cache = await caches.open('luxury-sync-v2');
    const cacheKey = new Request('/__sync__/' + Date.now() + '_' + Math.random().toString(36).slice(2));
    const blob = new Blob([JSON.stringify(action)], { type: 'application/json' });
    const response = new Response(blob, {
      headers: { 'Content-Type': 'application/json' },
    });
    await cache.put(cacheKey, response);

    if ('sync' in ServiceWorkerRegistration.prototype) {
      const swReg = await navigator.serviceWorker.ready;
      await (swReg as unknown as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register('sync-actions');
    }
  } catch {
  }
}

export async function getPendingActions(): Promise<QueuedAction[]> {
  if (typeof caches === 'undefined') return [];
  try {
    const cache = await caches.open('luxury-sync-v2');
    const keys = await cache.keys();
    const actions: QueuedAction[] = [];
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const text = await response.text();
        try {
          actions.push(JSON.parse(text));
        } catch {
        }
      }
    }
    return actions;
  } catch {
    return [];
  }
}

export async function clearPendingActions(): Promise<void> {
  if (typeof caches === 'undefined') return;
  try {
    const cache = await caches.open('luxury-sync-v2');
    const keys = await cache.keys();
    await Promise.all(keys.map((k) => cache.delete(k)));
  } catch {
  }
}
