import crypto from 'crypto';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { fetchCustomerByAccessToken } from '@/lib/auth/customer';
import { getEnv } from '@/lib/env';
import { getRegion } from '@/lib/regions';

function isSafeRedirectPath(path: string): boolean {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (/^https?:\/\//i.test(path)) return false;
  if (path.includes('\n') || path.includes('\r')) return false;
  return true;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token?: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const url = new URL(request.url);

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/${locale}/account/login?error=${encodeURIComponent(error)}`, request.url));
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get('oauth_state')?.value;
  const codeVerifier = cookieStore.get('oauth_verifier')?.value;
  const rawRedirectTo = cookieStore.get('oauth_redirect')?.value || `/${locale}/account`;
  const redirectTo = isSafeRedirectPath(rawRedirectTo) ? rawRedirectTo : `/${locale}/account`;

  if (!state || state !== storedState) {
    return NextResponse.redirect(new URL(`/${locale}/account/login?error=invalid_state`, request.url));
  }

  if (!code || !codeVerifier) {
    return NextResponse.redirect(new URL(`/${locale}/account/login?error=missing_code`, request.url));
  }

  const env = getEnv();
  const region = getRegion(locale);
  const shopDomain = region.shopifyDomain;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${request.headers.get('host') ?? 'localhost'}`;
  const callbackPath = `/${locale}/api/auth/oauth/callback`;
  const callbackUrl = `${appUrl.replace(/\/$/, '')}${callbackPath}`;

  try {
    const tokenUrl = `https://${shopDomain}/auth/oauth/token`;

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: env.SHOPIFY_CLIENT_ID,
        client_secret: env.SHOPIFY_CLIENT_SECRET,
        code,
        redirect_uri: callbackUrl,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }

    const tokens = (await tokenResponse.json()) as TokenResponse;

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

    const oauthCookies = ['oauth_state', 'oauth_verifier', 'oauth_redirect'];
    oauthCookies.forEach((name) => redirectResponse.cookies.set(name, '', { ...cookieOptions, maxAge: 0 }));

    redirectResponse.cookies.set('access_token', tokens.access_token, { ...cookieOptions, maxAge: tokens.expires_in });
    redirectResponse.cookies.set('refresh_token', tokens.refresh_token, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
    redirectResponse.cookies.set('access_token_hash', accessTokenHash, { ...cookieOptions, maxAge: tokens.expires_in });
    redirectResponse.cookies.set('id_token', idToken, { ...cookieOptions, maxAge: tokens.expires_in });

    if (customer?.id) {
      redirectResponse.cookies.set('shopify_customer_id', customer.id, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return redirectResponse;
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(new URL(`/${locale}/account/login?error=auth_failed`, request.url));
  }
}