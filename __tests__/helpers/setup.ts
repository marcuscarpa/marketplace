import { vi } from 'vitest';

import { applyTestEnv } from './test-env';

applyTestEnv();

vi.stubGlobal('console', {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
});
