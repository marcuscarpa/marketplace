import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/lib/cache/lock.ts',
        'src/lib/cache/stampede.ts',
        'src/lib/redis/client.ts',
        'src/lib/shopify/client.ts',
        'src/lib/shopify/loader.ts',
      ],
      thresholds: {
        lines: 55,
        functions: 55,
        branches: 50,
      },
    },
  },
});
