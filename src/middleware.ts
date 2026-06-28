import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'pt'] as const;

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

  if (pathname === '/') {
    const acceptLanguage = request.headers.get('accept-language') ?? '';
    const segments = acceptLanguage.split(',');
    const preferred = segments[0]?.trim().substring(0, 2).toLowerCase() ?? 'en';
    const locale = SUPPORTED_LOCALES.includes(preferred as typeof SUPPORTED_LOCALES[number])
      ? preferred
      : 'en';
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};