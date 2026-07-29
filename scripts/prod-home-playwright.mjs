/**
 * Real production homepage audit via Playwright.
 */
import { chromium } from '@playwright/test';

const URL = process.env.PROD_URL ?? 'https://sinesia.jethro.agency/en';
const RUNS = Number(process.env.RUNS ?? 3);

function fmt(ms) {
  return `${Math.round(ms)}ms`;
}

const browser = await chromium.launch({ headless: true });
const results = [];

for (let i = 0; i < RUNS; i++) {
  const context = await browser.newContext({
    serviceWorkers: i === 0 ? 'allow' : 'block',
  });
  const page = await context.newPage();

  const requests = [];
  page.on('request', (req) => {
    requests.push({ url: req.url(), start: Date.now(), type: req.resourceType() });
  });
  page.on('requestfinished', async (req) => {
    const entry = requests.find((r) => r.url === req.url() && !r.end);
    if (!entry) return;
    entry.end = Date.now();
    try {
      const res = await req.response();
      entry.status = res?.status() ?? 0;
    } catch {
      entry.status = 0;
    }
  });
  page.on('requestfailed', (req) => {
    const entry = requests.find((r) => r.url === req.url() && !r.end);
    if (entry) {
      entry.end = Date.now();
      entry.failed = true;
    }
  });

  const started = Date.now();
  let navError = null;
  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120_000 });
  } catch (e) {
    navError = String(e);
  }
  const domMs = Date.now() - started;

  let h1 = '';
  try {
    await page.waitForSelector('h1', { timeout: 10_000 });
    h1 = ((await page.locator('h1').first().textContent()) ?? '').replace(/\s+/g, ' ').trim();
  } catch {}

  const timing = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0];
    if (!n) return null;
    return {
      ttfb: n.responseStart,
      domInteractive: n.domInteractive,
      domComplete: n.domComplete,
      loadEventEnd: n.loadEventEnd,
    };
  }).catch(() => null);

  const slow = requests
    .filter((r) => r.end)
    .map((r) => ({ ...r, duration: r.end - r.start }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 12);

  results.push({
    run: i + 1,
    sw: i === 0 ? 'allow' : 'block',
    domMs,
    navError,
    h1,
    timing,
    slow,
  });

  await context.close();
}

await browser.close();

console.log(`\n=== Production Playwright audit: ${URL} ===\n`);

for (const r of results) {
  console.log(`Run #${r.run} (SW ${r.sw})`);
  console.log(`  domcontentloaded: ${fmt(r.domMs)}`);
  if (r.navError) console.log(`  ERROR: ${r.navError}`);
  if (r.timing) {
    console.log(
      `  ttfb=${fmt(r.timing.ttfb)} domInteractive=${fmt(r.timing.domInteractive)} domComplete=${fmt(r.timing.domComplete)} load=${fmt(r.timing.loadEventEnd)}`,
    );
  }
  console.log(`  h1: ${r.h1 || '(missing)'}`);
  console.log('  slowest requests:');
  for (const req of r.slow) {
    const path = req.url.replace('https://sinesia.jethro.agency', '');
    console.log(
      `    - ${fmt(req.duration)} ${req.failed ? 'FAILED' : req.status ?? '?'} ${req.type} ${path}`,
    );
  }
  console.log('');
}

const worst = Math.max(...results.map((r) => r.domMs));
const best = Math.min(...results.map((r) => r.domMs));
console.log(`Summary: best=${fmt(best)} worst=${fmt(worst)}`);

if (worst > 8000) process.exit(1);
