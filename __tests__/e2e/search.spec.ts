import { test, expect } from '@playwright/test';

test.describe('Search Page', () => {
  test('should load search page', async ({ page }) => {
    await page.goto('/en/search');

    await expect(page).toHaveTitle(/Search/i);
  });

  test('should display search input', async ({ page }) => {
    await page.goto('/en/search');

    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();
  });

  test('should show empty state when no query', async ({ page }) => {
    await page.goto('/en/search');

    await expect(
      page.locator('text=Search for luxury products')
    ).toBeVisible();
  });

  test('should show no results for single character query', async ({ page }) => {
    await page.goto('/en/search?q=a');

    await expect(
      page.locator('text=No results found')
    ).toBeVisible();
  });

  test('should have search button', async ({ page }) => {
    await page.goto('/en/search');

    await expect(
      page.locator('button[type="submit"]')
    ).toBeVisible();
  });

  test('should show browse collections option when no results', async ({ page }) => {
    await page.goto('/en/search?q=xyz123nonexistent');

    await expect(
      page.locator('text=View All Collections')
    ).toBeVisible();
  });

  test('should navigate to collections when clicking browse link', async ({ page }) => {
    await page.goto('/en/search?q=xyz123nonexistent');

    await page.click('text=View All Collections');

    await expect(page).toHaveURL(/\/collections/);
  });

  test('should work with pt locale', async ({ page }) => {
    await page.goto('/pt/search');

    await expect(
      page.locator('text=Buscar Produtos')
    ).toBeVisible();

    await expect(
      page.locator('input[placeholder*="Buscar"]')
    ).toBeVisible();
  });
});