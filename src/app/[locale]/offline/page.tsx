import Link from 'next/link';

import { HEADER_OFFSET_TOP } from '@/components/storefront/ui';

interface OfflinePageProps {
  params: Promise<{ locale: string }>;
}

export default async function OfflinePage({ params }: OfflinePageProps) {
  const { locale } = await params;
  const isPt = locale === 'pt';

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center px-4 text-center ${HEADER_OFFSET_TOP}`}>
      <h1 className="text-4xl font-light tracking-wider">{isPt ? 'Você está offline' : "You're Offline"}</h1>
      <p className="mt-4 text-neutral-500">
        {isPt
          ? 'Verifique sua conexão e tente novamente. Algumas páginas vistas anteriormente ainda podem estar disponíveis.'
          : 'Check your connection and try again. Some previously viewed pages may still be available.'}
      </p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-block border border-black px-8 py-3 text-sm tracking-widest uppercase transition-colors hover:bg-black hover:text-white"
      >
        {isPt ? 'Tentar novamente' : 'Retry'}
      </Link>
    </div>
  );
}
