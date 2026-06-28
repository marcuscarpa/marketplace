import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { resolveRegion } from '@/lib/regions';

function isPrivateIp(ip: string): boolean {
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;
  if (ip.startsWith('172.')) {
    const second = parseInt(ip.substring(4, 6), 10);
    return second >= 16 && second <= 31;
  }
  return ip === '127.0.0.1' || ip === '::1';
}

function getClientIp(req: NextRequest): string {
  const vercel = req.headers.get('x-vercel-forwarded-for');
  if (vercel) {
    const ip = vercel.split(',')[0]?.trim() ?? 'unknown';
    if (ip && ip !== 'unknown' && !isPrivateIp(ip)) return ip;
  }
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const ip = forwarded.split(',')[0]?.trim() ?? 'unknown';
    if (ip && ip !== 'unknown' && !isPrivateIp(ip)) return ip;
  }
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export async function middleware(req: NextRequest) {
  const region = resolveRegion(req);

  const nonce = generateNonce();
  const requestId = crypto.randomUUID();

  const pathname = req.nextUrl.pathname;
  const method = req.method;

  if (method !== 'GET' && pathname.startsWith('/api/')) {
    const ip = getClientIp(req);
    const { allowed } = await rateLimit(ip, 30, 60000);
    if (!allowed) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'
      https://www.googletagmanager.com
      https://www.google-analytics.com
      https://connect.facebook.net
      https://analytics.tiktok.com
      https://static.klaviyo.com
      https://a.klaviyo.com
      https://o*.ingest.sentry.io;
    style-src 'self' 'nonce-${nonce}' https://cdn.shopify.com;
    img-src 'self' https://cdn.shopify.com https://framerusercontent.com data: https://www.google-analytics.com;
    connect-src 'self' https://*.shopify.com https://*.shopifysvc.com https://monorail-edge.shopifysvc.com https://checkout.shopify.com https://shop.app https://www.google-analytics.com https://analytics.tiktok.com https://connect.facebook.net https://static.klaviyo.com https://a.klaviyo.com https://o*.ingest.sentry.io;
    report-uri /api/csp-report;
    report-to csp-endpoint;
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('x-request-id', requestId);
  requestHeaders.set('x-trace-id', req.headers.get('x-trace-id') ?? crypto.randomUUID());
  requestHeaders.set('x-region', region.code);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('Reporting-Endpoints', 'csp-endpoint="/api/csp-report"');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};