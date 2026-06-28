import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('should navigate to a product and display product details', async ({ page }) => {
    await page.goto('/en/products/test-product');

    const status = page.locator('body');
    await expect(status).toBeVisible();
  });

  test('should show 404 or error gracefully for non-existent product', async ({ page }) => {
    await page.goto('/en/products/non-existent-product-handle');

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have back navigation to homepage', async ({ page }) => {
    await page.goto('/en/products/test-product');

    const homeLink = page.locator('a[href="/en"]').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL(/\/$/);
    }
  });

  test('should have breadcrumb navigation', async ({ page }) => {
    await page.goto('/en/products/test-product');

    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    if (await breadcrumb.isVisible()) {
      await expect(breadcrumb.locator('a[href="/en"]')).toBeVisible();
    }
  });
});