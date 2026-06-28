import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import React from 'react';
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

export const metadata: Metadata = {
  title: 'Timeless Sophistication',
  description: 'Curated leather goods and accessories — enduring design and contemporary craftsmanship.',
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
