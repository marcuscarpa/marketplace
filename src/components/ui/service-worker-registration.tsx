'use client';

import { useEffect } from 'react';

interface ServiceWorkerRegistrationProps {
  nonce: string;
}

export function ServiceWorkerRegistration({ nonce }: ServiceWorkerRegistrationProps) {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // ponytail: SW networkFirst on HTML/API caused 60s+ homepage stalls in production.
    void navigator.serviceWorker.getRegistrations().then((regs) =>
      Promise.all(regs.map((reg) => reg.unregister())),
    );
  }, [nonce]);

  return null;
}
