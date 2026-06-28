import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const b = await chromium.launch();

async function measure(url, w) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.getElementById('most-popular')?.scrollIntoView());

  const d = await p.evaluate(() => {
    const wrapper = document.querySelector('#most-popular > div:last-child');
    const article = document.querySelector('#most-popular article');
    const footer = article?.querySelector('a:last-of-type');
    const pick = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return { w: Math.round(r.width), h: Math.round(r.height), flexDir: s.flexDirection, gap: s.gap };
    };
    return { wrapper: pick(wrapper), article: pick(article), footer: pick(footer) };
  });
  await p.close();
  return d;
}

for (const w of [390, 1440]) {
  console.log('\n===', w, '===');
  console.log(JSON.stringify({ reference: await measure(designReferenceUrl(), w), local: await measure('http://127.0.0.1:3000/en', w) }, null, 2));
}

await b.close();
