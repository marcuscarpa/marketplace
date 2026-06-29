'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';

import { HEADER_OFFSET_TOP } from '@/components/storefront/ui';
import { m } from '@/lib/i18n';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname?.startsWith('/pt') ? 'pt' : 'en';
  const t = m(locale).error;
  const c = m(locale).common;

  useEffect(() => {
    Sentry.captureException(error, { extra: { digest: error.digest } });
    console.error('Unhandled error:', error, { digest: error.digest });
  }, [error]);

  return (
    <div className={`flex min-h-screen items-center justify-center px-4 ${HEADER_OFFSET_TOP}`}>
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-light text-gray-900 mb-4">{t.title}</h1>
        <p className="text-gray-500 text-sm mb-8">{t.body}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
        >
          {c.tryAgain}
        </button>
      </div>
    </div>
  );
}
