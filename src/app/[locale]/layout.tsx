import { headers } from 'next/headers';
import React from 'react';

import { ScrollProvider, CartProvider, WishlistProvider, AuthProvider } from '@/components/providers';
import { EdgeConfigProvider } from '@/components/providers/edge-config-provider';
import { Footer } from '@/components/storefront/footer';
import { Shell } from '@/components/storefront/shell';
import { ConsentBanner } from '@/components/ui/consent-banner';
import { LocaleHtmlLang } from '@/components/ui/locale-html-lang';
import { DynamicScripts } from '@/components/ui/dynamic-scripts';
import { ServiceWorkerRegistration } from '@/components/ui/service-worker-registration';
import { PwaUpdateBanner } from '@/components/ui/pwa-update-banner';
import { PwaInstallPrompt } from '@/components/ui/pwa-install-prompt';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined;

  return (
    <EdgeConfigProvider>
      <AuthProvider>
        <CartProvider locale={locale}>
          <WishlistProvider>
            <ScrollProvider>
              {nonce && <DynamicScripts nonce={nonce} />}
              {nonce && <ServiceWorkerRegistration nonce={nonce} />}
              <LocaleHtmlLang locale={locale} />
              <Shell locale={locale}>
                <main className="min-h-screen selection:bg-ink selection:text-white">{children}</main>
                <Footer locale={locale} />
              </Shell>
              <ConsentBanner locale={locale} />
              <PwaUpdateBanner locale={locale} />
              <PwaInstallPrompt locale={locale} />
            </ScrollProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </EdgeConfigProvider>
  );
}
