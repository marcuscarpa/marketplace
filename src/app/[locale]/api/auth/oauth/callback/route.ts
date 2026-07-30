import crypto from 'crypto';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { fetchCustomerByAccessToken } from '@/lib/auth/customer';
import { getOAuthCallbackUrl } from '@/lib/auth/customer-account-oauth';
import { exchangeCustomerAccountAuthCode } from '@/lib/auth/customer-account-tokens';
import { associateCartWithCustomer, CART_COOKIE } from '@/lib/cart/buyer-identity';

function isSafeRedirectPath(path: string): boolean {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (/^https?:\/\//i.test(path)) return false;
  if (path.includes('\n') || path.includes('\r')) return false;
  return true;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const url = new URL(request.url);

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/${locale}/account/login?error=${encodeURIComponent(error)}`, request.url),
    );
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get('oauth_state')?.value;
  const codeVerifier = cookieStore.get('oauth_verifier')?.value;
  const rawRedirectTo = cookieStore.get('oauth_redirect')?.value || `/${locale}/account`;
  const redirectTo = isSafeRedirectPath(rawRedirectTo) ? rawRedirectTo : `/${locale}/account`;

  if (!state || state !== storedState) {
    return NextResponse.redirect(
      new URL(`/${locale}/account/login?error=invalid_state`, request.url),
    );
  }

  if (!code || !codeVerifier) {
    return NextResponse.redirect(
      new URL(`/${locale}/account/login?error=missing_code`, request.url),
    );
  }

  const callbackUrl = getOAuthCallbackUrl(locale, request.headers.get('host'));

  try {
    const tokens = await exchangeCustomerAccountAuthCode({
      locale,
      code,
      redirectUri: callbackUrl,
      codeVerifier,
    });

    const customer = await fetchCustomerByAccessToken(tokens.access_token, locale);

    const accessTokenHash = crypto.createHash('sha256').update(tokens.access_token).digest('hex');
    const idToken = tokens.id_token || '';

    const redirectResponse = NextResponse.redirect(new URL(redirectTo, request.url));
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    const oauthCookies = ['oauth_state', 'oauth_verifier', 'oauth_redirect', 'oauth_nonce'];
    oauthCookies.forEach((name) =>
      redirectResponse.cookies.set(name, '', { ...cookieOptions, maxAge: 0 }),
    );

    redirectResponse.cookies.set('access_token', tokens.access_token, {
      ...cookieOptions,
      maxAge: tokens.expires_in,
    });
    redirectResponse.cookies.set('refresh_token', tokens.refresh_token ?? '', {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
    redirectResponse.cookies.set('access_token_hash', accessTokenHash, {
      ...cookieOptions,
      maxAge: tokens.expires_in,
    });
    redirectResponse.cookies.set('id_token', idToken, {
      ...cookieOptions,
      maxAge: tokens.expires_in,
    });
    redirectResponse.cookies.set('shopify_locale', locale, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });

    if (customer?.id) {
      redirectResponse.cookies.set('shopify_customer_id', customer.id, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    const cartId = cookieStore.get(CART_COOKIE)?.value;
    if (cartId && customer) {
      await associateCartWithCustomer({
        locale,
        cartId,
        accessToken: tokens.access_token,
        email: customer.email,
      });
    }

    return redirectResponse;
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(
      new URL(`/${locale}/account/login?error=auth_failed`, request.url),
    );
  }
}
