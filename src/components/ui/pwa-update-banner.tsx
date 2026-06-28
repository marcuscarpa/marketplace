'use client';

import { useEffect, useState, useCallback } from 'react';

export function PwaUpdateBanner({ locale = 'en' }: { locale?: string }) {
  const [updateReady, setUpdateReady] = useState(false);

  const handleUpdate = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }, []);

  useEffect(() => {
    const handler = () => setUpdateReady(true);
    window.addEventListener('sw-update-ready', handler);
    return () => window.removeEventListener('sw-update-ready', handler);
  }, []);

  if (!updateReady) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-lg border border-neutral-200 bg-white px-5 py-3 shadow-lg"
    >
      <p className="text-sm text-neutral-700">{locale === 'pt' ? 'Nova versão disponível' : 'New version available'}</p>
      <button
        onClick={handleUpdate}
        className="rounded bg-black px-4 py-1.5 text-xs font-medium tracking-wider text-white transition-colors hover:bg-neutral-800"
      >
        {locale === 'pt' ? 'Atualizar' : 'Update'}
      </button>
    </div>
  );
}
