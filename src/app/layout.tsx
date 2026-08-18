import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import React from 'react';

import {
  getAppUrl,
  getSocialShareImageUrl,
  resolveMetadataBase,
  SITE_DESCRIPTION,
} from '@/lib/site-metadata';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

const ibmPlex = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-ibm-plex',
  display: 'swap',
});

const FAVICON = '/Favicon_sinesia.ico';
const metadataBaseResolved = resolveMetadataBase();
const sharePreviewImageUrl = getSocialShareImageUrl();
const ogTitle = 'Designer Swimwear & Bikini Collection | SINESIA KAROL';

export const metadata: Metadata = {
  metadataBase: metadataBaseResolved,
  title: {
    default: ogTitle,
    template: '%s | Sinesia Karol',
  },
  description: SITE_DESCRIPTION,
  applicationName: 'Sinesia Karol',
  icons: {
    icon: FAVICON,
    shortcut: FAVICON,
    apple: FAVICON,
  },
  openGraph: {
    type: 'website',
    url: getAppUrl(),
    siteName: 'Sinesia Karol',
    title: ogTitle,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: sharePreviewImageUrl,
        alt: 'Sinesia Karol',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: ogTitle,
    description: SITE_DESCRIPTION,
    images: [sharePreviewImageUrl],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black',
  },
};

export const viewport: Viewport = {
  themeColor: '#030607',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${instrument.variable} ${ibmPlex.variable}`}>
      <body className="font-sans-ui antialiased">{children}</body>
    </html>
  );
}
