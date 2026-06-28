import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

/**
 * Flat config for ESLint 9 + Next.js 15.5 + react-hooks@6.
 *
 * Avoids `@rushstack/eslint-patch` (incompatible with Node 24).
 */
export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
      '*.config.{js,mjs,cjs,ts}',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
      '@next/next': nextPlugin,
      'react-hooks': reactHooks,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-undef': 'off',
      // Stylistic rules that don't affect runtime — left to formatters/TS.
      'import/order': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...tsPlugin.configs.recommended.rules,
      // TypeScript already enforces these at the type level. ESLint's
      // version adds noise (and treats some valid patterns as errors).
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': ['warn', { allow: ['error'] }],
      eqeqeq: ['error', 'always'],
    },
  },
];