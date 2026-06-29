import { describe, expect, it } from 'vitest';

import {
  getAppUrl,
  getSocialShareImageUrl,
  PRESENTATION_APP_URL,
} from '@/lib/site-metadata';

describe('getAppUrl', () => {
  it('defaults to the presentation deploy URL', () => {
    const previous = process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(getAppUrl()).toBe(PRESENTATION_APP_URL);
    if (previous === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previous;
  });
});

describe('getSocialShareImageUrl', () => {
  it('returns an absolute HTTPS og image with cache-bust query', () => {
    const previous = process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(getSocialShareImageUrl()).toBe(
      'https://sinesia.jethro.agency/og-share.jpg?v=20260629'
    );
    if (previous === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previous;
  });
});
