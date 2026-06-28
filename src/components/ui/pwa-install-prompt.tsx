'use client';

import { useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed === 'true') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setVisible(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
  }, []);

  useEffect(() => {
    const handler = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Install app"
      className="fixed bottom-20 right-6 z-50 flex w-72 flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-5 shadow-lg"
    >
      <p className="text-sm font-medium text-neutral-900">Install Luxury Store</p>
      <p className="text-xs text-neutral-500">Add to your home screen for the best experience.</p>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 rounded bg-black px-3 py-2 text-xs font-medium tracking-wider text-white transition-colors hover:bg-neutral-800"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="rounded border border-neutral-200 px-3 py-2 text-xs text-neutral-600 transition-colors hover:bg-neutral-50"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
