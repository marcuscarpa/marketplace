import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage();

async function measure(url, w) {
  await p.setViewportSize({ width: w, height: 900 });
  await p.goto(url, { waitUntil: 'networkidle' });
  return p.evaluate(() => {
    const text = [...document.querySelectorAll('p')].find((x) =>
      /discounts for new customers/i.test(x.textContent),
    );
    const bar = text?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
    const pick = (node) => {
      if (!node) return null;
      const s = getComputedStyle(node);
      const r = node.getBoundingClientRect();
      return {
        h: Math.round(r.height),
        pad: s.padding,
        fontSize: s.fontSize,
        lh: s.lineHeight,
        ls: s.letterSpacing,
        fw: s.fontWeight,
        color: s.color,
        bg: s.backgroundColor,
      };
    };
    return { bar: pick(bar), text: pick(text) };
  });
}

for (const w of [390, 1440]) {
  const reference = await measure(designReferenceUrl(), w);
  const local = await measure('http://127.0.0.1:3000/en', w);
  console.log(w, { reference, local });
}

await b.close();
