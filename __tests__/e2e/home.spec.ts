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

  test('should display hero products widget on Our values banner', async ({ page }) => {
    await page.goto('/');

    const widget = page.locator('.hero__products');
    await widget.scrollIntoViewIfNeeded();
    await expect(widget).toBeVisible();
    await expect(widget.locator('a[href*="/products/madison-one-piece"]')).toBeVisible();
    await expect(widget.locator('.hero-products__open-more')).toBeVisible();
    await widget.locator('.hero-products__open-more').click();
    await expect(widget).toHaveClass(/active-2/);
    await expect(widget.locator('a[href*="/products/madison-one-piece"]')).toHaveCount(4);
    await widget.locator('a[href*="/products/madison-one-piece"]').first().click();
    await expect(page).toHaveURL(/\/products\/madison-one-piece/);
  });
});
