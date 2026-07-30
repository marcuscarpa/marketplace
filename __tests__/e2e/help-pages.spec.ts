import { test, expect } from '@playwright/test';

const HELP_PAGES = [
  { path: '/en/shipping', title: 'Shipping Policy' },
  { path: '/en/returns', title: 'Returns and Exchanges' },
  { path: '/en/contact', title: 'Make Contact' },
  { path: '/en/size-chart', title: 'Size Guide' },
  { path: '/en/privacy', title: 'Privacy Policy' },
  { path: '/en/terms', title: 'Terms and Conditions' },
  { path: '/en/terms-of-use', title: 'Terms of Use' },
  { path: '/en/cookies', title: 'Cookie Policy' },
  { path: '/en/mobile-terms', title: 'Mobile Terms of Service' },
] as const;

const ABOUT_PAGES = [
  { path: '/en/about', title: 'About Us' },
  { path: '/en/meet-the-designer', title: 'Meet the Designer' },
  { path: '/en/our-brand', title: 'Our Brand' },
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

test.describe('About pages (Sinesia Karol)', () => {
  test.describe.configure({ mode: 'serial' });

  for (const aboutPage of ABOUT_PAGES) {
    test(`${aboutPage.path} shows title`, async ({ page }) => {
      await page.goto(aboutPage.path, { waitUntil: 'networkidle', timeout: 60_000 });
      await expect(page.getByRole('heading', { name: aboutPage.title, level: 1 })).toBeVisible();
    });
  }
});
