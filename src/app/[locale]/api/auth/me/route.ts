import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { isAccessTokenExpired } from '@/lib/auth/access-token';
import { fetchCustomerByAccessToken } from '@/lib/auth/customer';
import { clearAuthSessionCookies } from '@/lib/auth/session-cookies';

const AUTH_ME_TIMEOUT_MS = 2_000;

function guestResponse(clearSession = false) {
  const response = NextResponse.json({ customer: null });
  if (clearSession) clearAuthSessionCookies(response);
  return response;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const sessionLocale = cookieStore.get('shopify_locale')?.value || locale;

  if (!accessToken) {
    return guestResponse();
  }

  if (isAccessTokenExpired(accessToken)) {
    return guestResponse(true);
  }

  try {
    const customer = await Promise.race([
      fetchCustomerByAccessToken(accessToken, sessionLocale),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), AUTH_ME_TIMEOUT_MS);
      }),
    ]);

    if (!customer) {
      return guestResponse(true);
    }

    return NextResponse.json({ customer });
  } catch {
    return guestResponse(true);
  }
}
