import { describe, expect, it } from 'vitest';

import { getAppUrl, PRESENTATION_APP_URL } from '@/lib/site-metadata';

describe('getAppUrl', () => {
  it('defaults to the presentation deploy URL', () => {
    const previous = process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(getAppUrl()).toBe(PRESENTATION_APP_URL);
    if (previous === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previous;
  });
});
