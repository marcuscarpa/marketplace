'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function ConsentBanner({ locale = 'en' }: { locale?: string }) {
  const [show, setShow] = useState(false);
  const isPt = locale === 'pt';
  const cookiePolicyHref = `/${locale}/cookies`;

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

  const persistConsent = (accepted: boolean) => {
    const storedUserId = localStorage.getItem('anonymous-user-id');
    const userId = storedUserId ?? crypto.randomUUID();
    if (!storedUserId) localStorage.setItem('anonymous-user-id', userId);
    localStorage.setItem('cookie-consent', JSON.stringify({ accepted, timestamp: Date.now() }));
    fetch('/api/compliance/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, consent: accepted, version: '1.0' }),
    }).catch(console.error);
    setShow(false);
  };

  const accept = () => persistConsent(true);
  const decline = () => persistConsent(false);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="consent-banner"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="cookie-policy__bar"
        role="dialog"
        aria-label={isPt ? 'Consentimento de cookies' : 'Cookie consent'}
      >
        <div className="cookie-policy__bar-close">
          <button
            type="button"
            className="btn btn--clear btn--close"
            onClick={decline}
            aria-label={isPt ? 'Fechar' : 'Close'}
          />
        </div>
        <div className="cookie-policy__bar-text">
          <p>
            {isPt
              ? 'Utilizamos cookies próprios e de terceiros para fins analíticos e para lhe mostrar publicidade relacionada com as suas preferências, com base nos seus hábitos de navegação e perfil.'
              : 'We use first-party and third-party cookies for analytical purposes and to show you advertising related to your preferences, based on your browsing habits and profile.'}
          </p>
          <p>
            {isPt ? (
              <>
                Também pode aceitar todos os cookies clicando em &quot;Aceitar todos os cookies&quot;. Para mais
                informações, consulte a nossa{' '}
                <Link href={cookiePolicyHref}>Política de Cookies</Link>
              </>
            ) : (
              <>
                You can also accept all cookies by clicking on &quot;Accept all cookies&quot;. For more information,
                please consult our <Link href={cookiePolicyHref}>Cookie Policy</Link>
              </>
            )}
          </p>
        </div>
        <div className="cookie-policy__bar-btns">
          <Link href={cookiePolicyHref} className="cta">
            {isPt ? 'Política de Cookies' : 'Cookie Policy'}
          </Link>
          <button type="button" className="btn btn--accept" onClick={accept}>
            {isPt ? 'Aceitar Todos os Cookies' : 'Accept All Cookies'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
