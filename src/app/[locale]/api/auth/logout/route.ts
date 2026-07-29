import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { revokeCustomerAccountRefreshToken } from '@/lib/auth/customer-account-tokens';
import { clearAuthSessionCookies } from '@/lib/auth/session-cookies';

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean) as string[];

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
      await revokeCustomerAccountRefreshToken(locale, refreshToken);
    } catch {
      // Still clear local session if revoke fails.
    }
  }

  const response = NextResponse.json({ success: true });
  clearAuthSessionCookies(response);

  return response;
}
