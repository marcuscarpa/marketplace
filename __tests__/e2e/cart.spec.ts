import { test, expect } from '@playwright/test';

test.describe('Cart Page', () => {
  test('should load cart page', async ({ page }) => {
    await page.goto('/en/cart');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should display empty cart message when no items', async ({ page }) => {
    await page.goto('/en/cart');

    const emptyMessage = page.locator('text=Your cart is empty');
    await expect(emptyMessage).toBeVisible();
  });

  test('should have continue shopping link when cart is empty', async ({ page }) => {
    await page.goto('/en/cart');

    const continueLink = page.locator('a:has-text("Continue Shopping")');
    await expect(continueLink).toBeVisible();
  });

  test('should have cart heading', async ({ page }) => {
    await page.goto('/en/cart');

    await expect(page.locator('h1')).toHaveText('Your Cart');
  });

  test('should have cart page in pt locale', async ({ page }) => {
    await page.goto('/pt/cart');

    await expect(page.locator('h1')).toHaveText('Seu Carrinho');

    const emptyMessage = page.locator('text=Seu carrinho está vazio');
    await expect(emptyMessage).toBeVisible();
  });
});