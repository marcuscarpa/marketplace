import { describe, expect, it } from 'vitest';

import {
  getAppUrl,
  getSocialShareImageUrl,
  PRESENTATION_APP_URL,
  resolveMetadataBase,
} from '@/lib/site-metadata';

describe('resolveMetadataBase', () => {
  it('uses origin only when env URL includes a locale path', () => {
    const previousSite = process.env.NEXT_PUBLIC_SITE_URL;
    const previousApp = process.env.NEXT_PUBLIC_APP_URL;
    process.env.NEXT_PUBLIC_SITE_URL = '';
    process.env.NEXT_PUBLIC_APP_URL = 'https://sinesia.jethro.agency/en';
    expect(resolveMetadataBase()?.origin).toBe('https://sinesia.jethro.agency');
    if (previousSite === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previousSite;
    if (previousApp === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previousApp;
  });
});

describe('getAppUrl', () => {
  it('defaults to the presentation deploy URL', () => {
    const previousSite = process.env.NEXT_PUBLIC_SITE_URL;
    const previousApp = process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(getAppUrl()).toBe(PRESENTATION_APP_URL);
    if (previousSite === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previousSite;
    if (previousApp === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previousApp;
  });
});

describe('getSocialShareImageUrl', () => {
  it('returns an absolute HTTPS og image at site root with cache-bust query', () => {
    const previousSite = process.env.NEXT_PUBLIC_SITE_URL;
    const previousApp = process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(getSocialShareImageUrl()).toBe(
      'https://sinesia.jethro.agency/og-share.jpg?v=20260630'
    );
    if (previousSite === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previousSite;
    if (previousApp === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previousApp;
  });

  it('never prefixes locale into the og image path', () => {
    const previousSite = process.env.NEXT_PUBLIC_SITE_URL;
    const previousApp = process.env.NEXT_PUBLIC_APP_URL;
    process.env.NEXT_PUBLIC_SITE_URL = '';
    process.env.NEXT_PUBLIC_APP_URL = 'https://sinesia.jethro.agency/en';
    expect(getSocialShareImageUrl()).toBe(
      'https://sinesia.jethro.agency/og-share.jpg?v=20260630'
    );
    if (previousSite === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previousSite;
    if (previousApp === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previousApp;
  });
});
