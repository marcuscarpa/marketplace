import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getEnv } from '@/lib/env';
import { getRegion } from '@/lib/regions';

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean) as string[];

const AUTH_COOKIES = ['access_token', 'refresh_token', 'access_token_hash', 'id_token', 'shopify_customer_id', 'shopify_locale'];

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && ALLOWED_ORIGINS.length > 0 && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;
  const locale = cookieStore.get('shopify_locale')?.value || 'en';

  if (refreshToken) {
    try {
      const env = getEnv();
      const region = getRegion(locale);
      const shopDomain = region.shopifyDomain;

      await fetch(`https://${shopDomain}/auth/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: env.SHOPIFY_CLIENT_ID,
          client_secret: env.SHOPIFY_CLIENT_SECRET,
          refresh_token: refreshToken,
          action: 'revoke',
        }),
      });
    } catch {
    }
  }

  const response = NextResponse.json({ success: true });
  AUTH_COOKIES.forEach((name) => {
    response.cookies.set(name, '', { path: '/', maxAge: 0, httpOnly: true, secure: true, sameSite: 'lax' });
  });

  return response;
}