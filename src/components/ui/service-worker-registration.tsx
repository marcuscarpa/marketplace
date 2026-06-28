'use client';

import { useEffect } from 'react';

interface ServiceWorkerRegistrationProps {
  nonce: string;
}

export function ServiceWorkerRegistration({ nonce }: ServiceWorkerRegistrationProps) {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // ponytail: SW cache-first on *.js breaks Next dev chunks (ChunkLoadError on layout.js)
    if (process.env.NODE_ENV === 'development') {
      void navigator.serviceWorker.getRegistrations().then((regs) =>
        Promise.all(regs.map((reg) => reg.unregister()))
      );
      return;
    }

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const installing = reg.installing;
        if (installing) {
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              window.dispatchEvent(new CustomEvent('sw-update-ready'));
            }
          });
        }
      });
    });
  }, [nonce]);

  return null;
}
