import { describe, expect, it } from 'vitest';

import { LEGACY_COLLECTION_REDIRECTS } from '@/lib/catalog/collection-handles';

describe('LEGACY_COLLECTION_REDIRECTS', () => {
  it('never maps a handle to itself (avoids redirect loops)', () => {
    for (const [legacy, target] of Object.entries(LEGACY_COLLECTION_REDIRECTS)) {
      expect(target).not.toBe(legacy);
    }
  });
});
