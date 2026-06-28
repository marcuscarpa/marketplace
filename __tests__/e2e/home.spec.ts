import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Timeless Sophistication/i);
  });

  test('should display hero section with headline', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Essentials');
  });

  test('should display navigation links', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('a[href*="collections"]').first()).toBeVisible();
  });

  test('should display search link in header', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('a[href*="search"]').first()).toBeVisible();
  });

  test('should have a working search link', async ({ page }) => {
    await page.goto('/');

    await page.locator('a[href*="search"]').first().click();

    await expect(page).toHaveURL(/\/search/);
  });

  test('should display Our values section', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'The Haute Couture of Beachwear' })
    ).toBeVisible();
  });
});
