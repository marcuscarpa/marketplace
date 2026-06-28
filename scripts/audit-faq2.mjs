import { designReferenceUrl, REF_SITE_CLASS_TOKEN } from './lib/reference.mjs';
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(designReferenceUrl(), { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 1500));

const refDom = { c: REF_SITE_CLASS_TOKEN };

const data = await page.evaluate(({ c }) => {
  const q = [...document.querySelectorAll('p')].find((p) => p.textContent.trim() === 'Is there wholesale opportunities?');
  const row = q?.parentElement?.parentElement;
  const s = row ? getComputedStyle(row) : null;
  const r = row?.getBoundingClientRect();

  const list = q?.closest(`ol,ul,div[class*="${c}"]`);
  const items = list ? [...list.querySelectorAll('p')].filter((p) => p.textContent.includes('?')) : [];

  return {
    rowH: r?.height,
    rowBorder: s?.borderBottom,
    rowPy: s?.paddingTop,
    itemCount: items.length,
    firstItemFont: q ? getComputedStyle(q).fontSize : null,
    plusSize: (() => {
      const svg = row?.querySelector('svg');
      return svg ? svg.getBoundingClientRect().width : null;
    })(),
    social: (() => {
      const h = [...document.querySelectorAll('h6,h5,p')].find((el) => /follow us on socials/i.test(el.textContent));
      if (!h) return null;
      const hs = getComputedStyle(h);
      return { tag: h.tagName, font: hs.fontSize, weight: hs.fontWeight, tracking: hs.letterSpacing, textTransform: hs.textTransform };
    })(),
  };
}, refDom);

console.log(JSON.stringify(data, null, 2));
await browser.close();
