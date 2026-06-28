'use client';

import { usePathname } from 'next/navigation';

export default function Loading() {
  const isPt = usePathname().startsWith('/pt');

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-5">
      <div className="flex w-full max-w-xs flex-col items-center gap-5">
        <div className="h-px w-full overflow-hidden bg-ink/10">
          <div className="mkt-loading-bar h-full w-1/3 bg-ink/70" />
        </div>
        <p className="font-sans-ui text-[11px] uppercase tracking-[0.14em] text-ink/50">
          {isPt ? 'A carregar' : 'Loading'}
        </p>
      </div>
    </div>
  );
}
