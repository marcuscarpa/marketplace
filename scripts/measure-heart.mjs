import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const b = await chromium.launch();

async function measure(url, w) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.getElementById('most-popular')?.scrollIntoView());

  const d = await p.evaluate(() => {
    const article = document.querySelector('#most-popular article');
    const btn = article?.querySelector('button[aria-label="Add to favorites"]');
    const svg = btn?.querySelector('svg');
    const pick = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y), bg: s.backgroundColor, borderRadius: s.borderRadius };
    };
    return { btn: pick(btn), svg: pick(svg), svgColor: svg ? getComputedStyle(svg).fill || getComputedStyle(svg).color : null };
  });
  await p.close();
  return d;
}

for (const w of [390, 1440]) {
  console.log(w, { reference: await measure(designReferenceUrl(), w), local: await measure('http://127.0.0.1:3000/en', w) });
}

await b.close();
