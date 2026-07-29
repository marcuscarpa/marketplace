/**
 * Real-world homepage perf check: server TTFB + browser navigation timing.
 * Run with production server on :3000 (npm run start).
 */
import { chromium } from '@playwright/test';

const BASE = process.env.PERF_BASE_URL ?? 'http://127.0.0.1:3000';
const ROUTES = ['/en', '/en', '/en', '/pt'];
const MAX_SERVER_MS = 5_000;
const MAX_BROWSER_MS = 8_000;

function fmt(ms) {
  return `${ms}ms`;
}

async function measureFetch(url) {
  const start = performance.now();
  const res = await fetch(url, { redirect: 'follow' });
  const elapsed = Math.round(performance.now() - start);
  const html = await res.text();
  return {
    url,
    status: res.status,
    elapsed,
    bytes: html.length,
    hasHero: html.includes('hero-headline') || html.includes('Timeless'),
    hasNav: html.includes('collections') || html.includes('New Arrivals'),
    source: html.includes('"source":"shopify"') ? 'shopify' : html.includes('"source":"static"') ? 'static' : 'unknown',
  };
}

async function measureBrowser(page, path) {
  const start = performance.now();
  const response = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  const domMs = Math.round(performance.now() - start);

  await page.waitForSelector('h1', { timeout: 5_000 });
  const h1 = await page.locator('h1').first().textContent();
  const navVisible = await page.locator('a[href*="collections"]').first().isVisible();

  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    if (!nav) return null;
    return {
      ttfb: Math.round(nav.responseStart),
      domInteractive: Math.round(nav.domInteractive),
      domComplete: Math.round(nav.domComplete),
    };
  });

  return {
    path,
    status: response?.status() ?? 0,
    domMs,
    h1: (h1 ?? '').replace(/\s+/g, ' ').trim().slice(0, 80),
    navVisible,
    timing,
  };
}

let failed = false;

console.log('\n=== Homepage real perf check ===\n');
console.log(`Base URL: ${BASE}\n`);

console.log('--- Server response (fetch) ---');
for (let i = 0; i < ROUTES.length; i++) {
  const route = ROUTES[i];
  const result = await measureFetch(`${BASE}${route}`);
  const ok = result.status === 200 && result.elapsed <= MAX_SERVER_MS && result.hasHero && result.hasNav;
  if (!ok) failed = true;
  console.log(
    `#${i + 1} ${route}: ${fmt(result.elapsed)} status=${result.status} bytes=${result.bytes} hero=${result.hasHero} nav=${result.hasNav} ${ok ? 'PASS' : 'FAIL'}`,
  );
}

console.log('\n--- Browser navigation (Playwright / Chromium) ---');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

for (const route of ['/en', '/pt']) {
  const result = await measureBrowser(page, route);
  const ok =
    result.status === 200 &&
    result.domMs <= MAX_BROWSER_MS &&
    result.navVisible &&
    result.h1.length > 0;
  if (!ok) failed = true;
  console.log(
    `${route}: domcontentloaded=${fmt(result.domMs)} status=${result.status} nav=${result.navVisible} h1="${result.h1}" ${ok ? 'PASS' : 'FAIL'}`,
  );
  if (result.timing) {
    console.log(
      `  timing: ttfb=${fmt(result.timing.ttfb)} domInteractive=${fmt(result.timing.domInteractive)} domComplete=${fmt(result.timing.domComplete)}`,
    );
  }
}

await browser.close();

console.log('\n--- Thresholds ---');
console.log(`Server max: ${fmt(MAX_SERVER_MS)} | Browser domcontentloaded max: ${fmt(MAX_BROWSER_MS)}`);

if (failed) {
  console.log('\nRESULT: FAIL\n');
  process.exit(1);
}

console.log('\nRESULT: PASS — homepage loads within expected limits.\n');
