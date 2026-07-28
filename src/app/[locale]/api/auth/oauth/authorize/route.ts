import crypto from 'crypto';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getOpenIdConfiguration } from '@/lib/auth/customer-account-discovery';
import {
  getCustomerAccountScope,
  getOAuthCallbackUrl,
  getOAuthLocaleParams,
} from '@/lib/auth/customer-account-oauth';
import { sanitizeLoginHint } from '@/lib/auth/login-hint';
import { getEnv } from '@/lib/env';
import { getRegion } from '@/lib/regions';

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

function safeRedirectPath(path: string, locale: string): string {
  if (!path || typeof path !== 'string') return `/${locale}/account`;
  if (path.startsWith('//')) return `/${locale}/account`;
  if (/^https?:\/\//i.test(path)) return `/${locale}/account`;
  if (!path.startsWith('/')) return `/${locale}/account`;
  if (path.includes('\n') || path.includes('\r')) return `/${locale}/account`;
  return path;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const url = new URL(request.url);
  const redirectParam = url.searchParams.get('redirect') || '/account';
  const redirectTo = safeRedirectPath(redirectParam, locale);
  const loginHint = sanitizeLoginHint(
    url.searchParams.get('login_hint') ?? url.searchParams.get('email'),
  );

  const env = getEnv();
  const region = getRegion(locale);
  const shopDomain = region.shopifyDomain;

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString('hex');
  const nonce = crypto.randomBytes(16).toString('hex');

  let openId;
  try {
    openId = await getOpenIdConfiguration(shopDomain);
  } catch (err) {
    console.error('OAuth discovery error:', err);
    return NextResponse.redirect(
      new URL(`/${locale}/account/login?error=auth_failed`, request.url),
    );
  }

  const callbackUrl = getOAuthCallbackUrl(locale, url.host);
  const { locale: oauthLocale, region_country } = getOAuthLocaleParams(locale, region);
  const authUrl = new URL(openId.authorization_endpoint);

  authUrl.searchParams.set('client_id', env.SHOPIFY_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('scope', getCustomerAccountScope());
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('nonce', nonce);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('locale', oauthLocale);
  authUrl.searchParams.set('region_country', region_country);

  if (loginHint) {
    authUrl.searchParams.set('login_hint', loginHint);
  }

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 600,
  };

  cookieStore.set('oauth_state', state, cookieOptions);
  cookieStore.set('oauth_verifier', codeVerifier, cookieOptions);
  cookieStore.set('oauth_redirect', redirectTo, cookieOptions);
  cookieStore.set('oauth_nonce', nonce, cookieOptions);

  return NextResponse.redirect(authUrl.toString());
}
