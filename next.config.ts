import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import type { NextConfig } from 'next';

// ponytail: `next build` then `next dev` without cleaning leaves pages/_document.js → missing ./5611.js
if (
  process.env.NODE_ENV !== 'production' &&
  process.argv.some((arg) => arg === 'dev' || arg.endsWith('next-dev.js'))
) {
  const staleProductionPages = join(process.cwd(), '.next/server/pages/_document.js');
  if (existsSync(staleProductionPages)) {
    rmSync(join(process.cwd(), '.next'), { recursive: true, force: true });
    console.warn('[dev] Removed stale .next from a previous production build.');
  }
}

/**
 * Next.js configuration for the Luxury E-Commerce boilerplate.
 *
 * PPR (Partial Prerendering) is intentionally DISABLED.
 *
 * Rationale:
 * - Next.js 15.5 stable rejects `experimental.ppr` with:
 *   "The experimental feature 'experimental.ppr' can only be enabled when using
 *    the latest canary version of Next.js."
 * - PPR will be re-enabled once it ships in a stable release.
 * - Until then, the app uses default static + dynamic rendering,
 *   which is fully supported and tested.
 *
 * When re-enabling, use:
 *   experimental: { ppr: 'incremental' }
 * and add `export const experimental_ppr = true` to layouts/pages that need it.
 */
const cdnAssetOrigin = process.env.NEXT_PUBLIC_ASSET_ORIGIN ?? 'https://framerusercontent.com';
const cdnAssetHost = new URL(cdnAssetOrigin).hostname;

import { LEGACY_COLLECTION_REDIRECTS } from '@/lib/catalog/collection-handles';

const locales = ['en', 'pt'] as const;

const collectionRedirects = locales.flatMap((locale) => [
  ...Object.entries(LEGACY_COLLECTION_REDIRECTS).map(([legacy, target]) => ({
    source: `/${locale}/collections/${legacy}`,
    destination: `/${locale}/collections/${target}`,
    permanent: true,
  })),
  {
    source: `/${locale}/collections/hats/:tags`,
    destination: `/${locale}/collections/accessories`,
    permanent: true,
  },
]);

const nextConfig: NextConfig = {
  // ponytail: keep native Node resolution for observability/redis deps so dev
  // doesn't emit vendor-chunks/*.js references that go missing after build↔dev.
  serverExternalPackages: [
    '@opentelemetry/api',
    '@opentelemetry/sdk-node',
    '@opentelemetry/instrumentation',
    '@opentelemetry/instrumentation-http',
    '@opentelemetry/instrumentation-express',
    '@sentry/nextjs',
    'ioredis',
  ],
  // Lint is run via `npm run lint`; skip during `next build` to avoid
  // build failures from third-party plugin rule lookups that don't
  // ship with the project (e.g. eslint-plugin-react-hooks@6's
  // `react-hooks/set-state-in-effect` rule, referenced by
  // `next/core-web-vitals` but not installed in this project).
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: cdnAssetHost,
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.zimmermann.com',
        pathname: '/media/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return collectionRedirects;
  },
};

export default nextConfig;
