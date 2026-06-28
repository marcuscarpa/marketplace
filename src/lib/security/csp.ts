interface CspOptions {
  nonce: string;
  isProduction: boolean;
}

export function buildCspHeader({ nonce, isProduction }: CspOptions): string {
  const directives: string[] = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isProduction ? '' : " 'unsafe-eval'"}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' https://cdn.shopify.com data: blob:`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `connect-src 'self' https://*.shopify.com${isProduction ? '' : ' http://localhost:*'}`,
    `frame-ancestors 'none'`,
    `frame-src 'self'`,
    `base-uri 'self'`,
    `form-action 'self' https://*.shopify.com`,
    `object-src 'none'`,
    `media-src 'self'`,
    `manifest-src 'self'`,
    `worker-src 'self' blob:`,
    `upgrade-insecure-requests`,
  ];

  return directives.join('; ');
}

export function buildSecurityHeaders(): Record<string, string> {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'credentialless',
  };
}
