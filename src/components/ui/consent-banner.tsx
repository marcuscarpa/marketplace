'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function ConsentBanner({ locale = 'en' }: { locale?: string }) {
  const [show, setShow] = useState(false);
  const isPt = locale === 'pt';

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        setShow(true);
        return;
      }
      const parsed = JSON.parse(consent) as { accepted?: boolean };
      if (parsed.accepted === undefined) {
        setShow(true);
      }
    } catch {
      setShow(true);
    }
  }, []);

  const accept = () => {
    const storedUserId = localStorage.getItem('anonymous-user-id');
    const userId = storedUserId ?? crypto.randomUUID();
    if (!storedUserId) localStorage.setItem('anonymous-user-id', userId);
    localStorage.setItem('cookie-consent', JSON.stringify({ accepted: true, timestamp: Date.now() }));
    fetch('/api/compliance/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, consent: true, version: '1.0' }),
    }).catch(console.error);
    setShow(false);
  };

  const decline = () => {
    const storedUserId = localStorage.getItem('anonymous-user-id');
    const userId = storedUserId ?? crypto.randomUUID();
    if (!storedUserId) localStorage.setItem('anonymous-user-id', userId);
    localStorage.setItem('cookie-consent', JSON.stringify({ accepted: false, timestamp: Date.now() }));
    fetch('/api/compliance/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, consent: false, version: '1.0' }),
    }).catch(console.error);
    setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="consent-banner"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 md:bottom-4 md:left-auto md:right-4 md:w-96 bg-white border border-gray-200 rounded-lg shadow-xl p-6 z-50"
        role="dialog"
        aria-label="Cookie consent"
      >
      <p className="text-sm text-gray-700 mb-4">
        {isPt
          ? 'Utilizamos cookies para melhorar a sua experiência. Ao continuar a navegar, você concorda com o uso de cookies.'
          : 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.'}
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={decline}
          className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          {isPt ? 'Recusar' : 'Decline'}
        </button>
        <button
          onClick={accept}
          className="px-4 py-2 text-sm text-white bg-black border border-black rounded hover:bg-gray-900 transition-colors"
        >
          {isPt ? 'Aceitar' : 'Accept'}
        </button>
      </div>
    </motion.div>
    </AnimatePresence>
  );
}
