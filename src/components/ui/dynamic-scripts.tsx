'use client';

import { useEffect } from 'react';

interface DynamicScriptsProps {
  nonce: string;
}

export function DynamicScripts({ nonce }: DynamicScriptsProps) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cookie-consent');
      if (!stored) return;
      const parsed = JSON.parse(stored) as { accepted?: boolean };
      if (!parsed.accepted) return;
    } catch {
      return;
    }

    const scripts = [
      { src: 'https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX', async: true },
      { src: 'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=XXXX', async: true },
    ];

    scripts.forEach((script) => {
      const scriptEl = document.createElement('script');
      scriptEl.src = script.src;
      scriptEl.async = script.async;
      scriptEl.nonce = nonce;
      document.head.appendChild(scriptEl);
    });

    return () => {
      scripts.forEach((script) => {
        const existing = document.querySelector(`script[src="${script.src}"]`);
        if (existing) existing.remove();
      });
    };
  }, [nonce]);

  return null;
}