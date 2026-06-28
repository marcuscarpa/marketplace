import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(designReferenceUrl(), { waitUntil: 'networkidle' });

const d = await p.evaluate(() => {
  const h1 = document.querySelector('h1');
  const spans = [...(h1?.querySelectorAll('span') ?? [])];
  return {
    h1: h1
      ? {
          html: h1.innerHTML.slice(0, 500),
          ...(() => {
            const s = getComputedStyle(h1);
            const r = h1.getBoundingClientRect();
            return {
              w: Math.round(r.width),
              h: Math.round(r.height),
              fontSize: s.fontSize,
              lineHeight: s.lineHeight,
              letterSpacing: s.letterSpacing,
              color: s.color,
              fontFamily: s.fontFamily,
            };
          })(),
        }
      : null,
    spans: spans.map((sp, i) => {
      const s = getComputedStyle(sp);
      return {
        i,
        text: sp.textContent,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        color: s.color,
      };
    }),
  };
});

console.log(JSON.stringify(d, null, 2));
await b.close();
