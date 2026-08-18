import { NextRequest, NextResponse } from 'next/server';

/**
 * The site is offline: the coming soon landing takes over every route.
 * `/` and `/coming-soon` render the landing; everything else redirects to it.
 * Static assets (fonts, images, videos in /public) are never redirected.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let static assets from /public pass through untouched.
  if (/\.[a-zA-Z0-9]{1,5}$/.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname === '/coming-soon') {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/coming-soon', request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
