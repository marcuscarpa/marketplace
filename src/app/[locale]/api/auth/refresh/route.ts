import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { refreshCustomerAccountToken } from '@/lib/auth/customer-account-tokens';
import { withLock } from '@/lib/cache/lock';

export async function POST(
  _request: Request,
  _context: { params: Promise<{ locale: string }> },
) {
  const cookieStore = await cookies();
  const currentRefreshToken = cookieStore.get('refresh_token')?.value;

  if (!currentRefreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  const locale = cookieStore.get('shopify_locale')?.value || 'en';

  try {
    const newTokens = await withLock(`oauth:refresh:${currentRefreshToken.slice(0, 8)}`, async () =>
      refreshCustomerAccountToken(locale, currentRefreshToken),
    );

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
