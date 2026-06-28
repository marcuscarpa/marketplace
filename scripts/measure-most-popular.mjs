import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage();

async function measure(url, w) {
  await p.setViewportSize({ width: w, height: 1400 });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.getElementById('most-popular')?.scrollIntoView({ block: 'start' }));
  await p.waitForTimeout(300);

  return p.evaluate(() => {
    const section = document.getElementById('most-popular');
    const ol = section?.querySelector('ol');
    const article = section?.querySelector('article');
    const side = section?.querySelector('ol + div');
    const title = article?.querySelector('a:last-of-type p:first-of-type');
    const price = article?.querySelector('a:last-of-type p:last-of-type');
    const pick = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        pad: s.padding,
        gap: s.gap,
        display: s.display,
        flexDir: s.flexDirection,
        position: s.position,
        top: s.top,
      };
    };
    return {
      section: pick(section),
      ol: pick(ol),
      article: pick(article),
      side: pick(side),
      title: title ? getComputedStyle(title).fontSize : null,
      price: price
        ? { fontSize: getComputedStyle(price).fontSize, fw: getComputedStyle(price).fontWeight }
        : null,
    };
  });
}

for (const w of [390, 1440]) {
  const reference = await measure(designReferenceUrl(), w);
  const local = await measure('http://127.0.0.1:3000/en', w);
  console.log('\n===', w, '===');
  console.log(JSON.stringify({ reference, local }, null, 2));
}

await b.close();
