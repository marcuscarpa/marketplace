import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const VIEWPORT = { width: 1440, height: 900 };

async function measure(page, url, label) {
  await page.setViewportSize(VIEWPORT);
  await page.goto(url, { waitUntil: 'networkidle' });
  return page.evaluate((lbl) => {
    const a = [...document.querySelectorAll('a')].find((x) => /shop all/i.test(x.textContent));
    const container = a?.parentElement;
    const labelEl = lbl === 'reference' ? a?.querySelector('p') : a?.querySelector('span.relative');
    const pick = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        padding: s.padding,
        bg: s.backgroundColor,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        color: s.color,
      };
    };
    return { container: pick(container), link: pick(a), label: pick(labelEl) };
  }, label);
}

const b = await chromium.launch();
const p = await b.newPage();
const reference = await measure(p, designReferenceUrl(), 'reference');
const local = await measure(p, 'http://127.0.0.1:3000/en', 'local');
console.log(JSON.stringify({ reference, local }, null, 2));
await b.close();
