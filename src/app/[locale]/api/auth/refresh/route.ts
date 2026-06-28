import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { withLock } from '@/lib/cache/lock';
import { getEnv } from '@/lib/env';
import { getRegion } from '@/lib/regions';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export async function POST(
  _request: Request,
  _context: { params: Promise<{ locale: string }> }
) {
  const cookieStore = await cookies();
  const currentRefreshToken = cookieStore.get('refresh_token')?.value;

  if (!currentRefreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  const env = getEnv();
  const locale = cookieStore.get('shopify_locale')?.value || 'en';
  const region = getRegion(locale);
  const shopDomain = region.shopifyDomain;

  try {
    const newTokens = await withLock(`oauth:refresh:${currentRefreshToken.slice(0, 8)}`, async () => {
      const tokenUrl = `https://${shopDomain}/auth/oauth/token`;

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: env.SHOPIFY_CLIENT_ID,
          client_secret: env.SHOPIFY_CLIENT_SECRET,
          refresh_token: currentRefreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`);
      }

      return (await response.json()) as TokenResponse;
    });

    if (!newTokens.access_token) {
      throw new Error('No access token in refresh response');
    }

    cookieStore.set('access_token', newTokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: newTokens.expires_in,
    });

    if (newTokens.refresh_token) {
      cookieStore.set('refresh_token', newTokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Token refresh error:', err);
    return NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
  }
}