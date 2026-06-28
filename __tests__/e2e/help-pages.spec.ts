import { test, expect } from '@playwright/test';

const HELP_PAGES = [
  { path: '/en/shipping', title: 'Orders & Shipping' },
  { path: '/en/returns', title: 'Returns' },
  { path: '/en/faq', title: 'FAQ' },
  { path: '/en/contact', title: 'Contact Us' },
  { path: '/en/size-chart', title: 'Size Guide' },
  { path: '/en/privacy', title: 'Privacy Notice' },
] as const;

test.describe('Help pages (Sinesia Karol)', () => {
  test.describe.configure({ mode: 'serial' });

  for (const helpPage of HELP_PAGES) {
    test(`${helpPage.path} shows title and help menu`, async ({ page }) => {
      await page.goto(helpPage.path, { waitUntil: 'networkidle', timeout: 60_000 });
      await expect(page.getByText('Help Menu')).toBeVisible({ timeout: 30_000 });
      await expect(page.getByRole('heading', { name: helpPage.title, level: 1 })).toBeVisible();
    });
  }
});

test.describe('Zimmermann reference pages (Playwright navigation)', () => {
  const ZIM_URLS = [
    'https://www.zimmermann.com/us/shipping',
    'https://www.zimmermann.com/us/returns',
    'https://www.zimmermann.com/us/faq',
    'https://www.zimmermann.com/us/contactus',
    'https://www.zimmermann.com/us/size-chart',
    'https://www.zimmermann.com/us/privacy',
  ] as const;

  for (const url of ZIM_URLS) {
    test(`can navigate ${url}`, async ({ page }) => {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('body')).not.toBeEmpty();
    });
  }
});
