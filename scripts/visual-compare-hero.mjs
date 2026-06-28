import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import path from 'path';

const OUT = path.join('scripts', 'visual-diff');
mkdirSync(OUT, { recursive: true });

const VIEWPORT = { width: 1440, height: 900 };

async function measure(page, label) {
  await page.setViewportSize(VIEWPORT);
  await page.goto(label === 'reference' ? designReferenceUrl() : 'http://127.0.0.1:3000/en', {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(1500);

  const shot = path.join(OUT, `${label}-hero.png`);
  await page.screenshot({ path: shot, fullPage: false });

  const crop = path.join(OUT, `${label}-hero-crop.png`);
  await page.screenshot({ path: crop, clip: { x: 0, y: 0, width: 1440, height: 900 } });

  const m = await page.evaluate(() => {
    const pick = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        bottom: Math.round(r.bottom),
        font: s.fontSize,
        lh: s.lineHeight,
        color: s.color,
        bg: s.backgroundColor,
        pad: s.padding,
      };
    };

    const h1 = document.querySelector('h1');
    const shop = [...document.querySelectorAll('a')].find((a) => /shop all/i.test(a.textContent));
    const menu = [...document.querySelectorAll('button,a')].find((e) => /^(menu|close menu)$/i.test(e.textContent?.trim() || ''));
    const logo = [...document.querySelectorAll('a')].find((a) => a.textContent?.trim().toLowerCase() === 'mesco');
    const hero = h1?.closest('section');

    return {
      viewport: { h: window.innerHeight },
      hero: pick(hero),
      h1: pick(h1),
      shopAll: pick(shop),
      menu: pick(menu),
      logo: pick(logo),
      shopVisible: shop ? shop.getBoundingClientRect().bottom <= window.innerHeight : false,
      h1Visible: h1 ? h1.getBoundingClientRect().bottom <= window.innerHeight : false,
    };
  });

  return { label, shot, m };
}

const browser = await chromium.launch();
const page = await browser.newPage();

const reference = await measure(page, 'reference');
const local = await measure(page, 'local');

await browser.close();

console.log(JSON.stringify({ reference: reference.m, local: local.m }, null, 2));
console.log('\nScreenshots:', reference.shot, local.shot);
