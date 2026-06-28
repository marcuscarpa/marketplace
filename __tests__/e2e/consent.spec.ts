import { test, expect } from '@playwright/test';

test.describe('Consent Banner', () => {
  test('shows consent banner on homepage', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('.cookie-policy__bar');
    await expect(banner).toBeVisible({ timeout: 10000 });
  });
});
