import { headers } from 'next/headers';
import React from 'react';

import {
  ScrollProvider,
  CartProvider,
  WishlistProvider,
  AuthProvider,
  NewsletterModalProvider,
} from '@/components/providers';
import { EdgeConfigProvider } from '@/components/providers/edge-config-provider';
import { Footer } from '@/components/storefront/footer';
import { NewsletterModal } from '@/components/storefront/newsletter-modal';
import { Shell } from '@/components/storefront/shell';
import { ConsentBanner } from '@/components/ui/consent-banner';
import { LocaleHtmlLang } from '@/components/ui/locale-html-lang';
import { DynamicScripts } from '@/components/ui/dynamic-scripts';
import { ServiceWorkerRegistration } from '@/components/ui/service-worker-registration';
import { PwaUpdateBanner } from '@/components/ui/pwa-update-banner';
import { PwaInstallPrompt } from '@/components/ui/pwa-install-prompt';
import { getStaticNavigation } from '@/lib/catalog/navigation-static';

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
  const navigation = getStaticNavigation(locale);

  return (
    <EdgeConfigProvider>
      <AuthProvider locale={locale}>
        <CartProvider locale={locale}>
          <WishlistProvider locale={locale}>
            <NewsletterModalProvider>
            <ScrollProvider>
              {nonce && <DynamicScripts nonce={nonce} />}
              {nonce && <ServiceWorkerRegistration nonce={nonce} />}
              <LocaleHtmlLang locale={locale} />
              <Shell locale={locale} navigation={navigation}>
                <div className="min-h-screen selection:bg-ink selection:text-white">{children}</div>
                <Footer locale={locale} navigation={navigation} />
              </Shell>
              <NewsletterModal locale={locale} />
              <ConsentBanner locale={locale} />
              <PwaUpdateBanner locale={locale} />
              <PwaInstallPrompt locale={locale} />
            </ScrollProvider>
            </NewsletterModalProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </EdgeConfigProvider>
  );
}
