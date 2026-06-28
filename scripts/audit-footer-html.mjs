import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const URL = designReferenceUrl();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

const html = await page.evaluate(() => {
  const footer = document.querySelector('footer');
  return footer?.innerHTML.slice(0, 4000) || 'no footer';
});

console.log(html);
await browser.close();
