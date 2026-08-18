import { NextRequest, NextResponse } from 'next/server';

/**
 * Only `en` is live right now. The `/pt` locale is disabled until the
 * Brazilian Shopify store is ready — any `/pt/*` request redirects to `/en/*`.
 */
const DEFAULT_LOCALE = 'en' as const;

function isPrivateIp(ip: string): boolean {
  const parts = ip.split('.').map((p) => Number(p));
  if (parts.length !== 4 || parts.some((p) => isNaN(p))) return false;
  const [a, b] = parts;
  if (a === undefined || b === undefined) return false;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function getClientIp(request: NextRequest): string | null {
  const vercelFw = request.headers.get('x-vercel-forwarded-for');
  if (vercelFw) {
    const segments = vercelFw.split(',');
    const first = segments[0]?.trim();
    if (first && !isPrivateIp(first)) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp && !isPrivateIp(realIp)) return realIp;
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Disabled locale: /pt and /pt/... redirect to the English equivalent.
  if (pathname === '/pt' || pathname.startsWith('/pt/')) {
    const target = pathname === '/pt' ? '/en' : `/en${pathname.slice('/pt'.length)}`;
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Root always resolves to the live default locale.
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};