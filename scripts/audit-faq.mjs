import { designReferenceUrl, REF_SITE_COMPONENT_ATTR, REF_SITE_CLASS_TOKEN } from './lib/reference.mjs';
import { chromium } from 'playwright';

const URL = designReferenceUrl();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });

const refDom = { a: REF_SITE_COMPONENT_ATTR };

const faq = await page.evaluate(({ a }) => {
  const h = [...document.querySelectorAll('h3')].find((x) => /faq/i.test(x.textContent));
  const section = h?.closest(`[${a}="Desktop"]`) || h?.parentElement?.parentElement?.parentElement;
  const items = [...document.querySelectorAll('*')].filter(
    (el) => el.textContent?.trim() === 'Is there wholesale opportunities?' && el.children.length <= 1
  );

  const row = items.find((el) => el.tagName === 'P' || el.tagName === 'BUTTON')?.parentElement?.parentElement;
  const rowStyle = row ? getComputedStyle(row) : null;

  const dividers = section
    ? [...section.querySelectorAll('*')].filter((el) => {
        const s = getComputedStyle(el);
        return parseFloat(s.height) <= 1 && s.backgroundColor !== 'rgba(0, 0, 0, 0)';
      }).slice(0, 3)
    : [];

  return {
    headingMb: (() => {
      const first = items[0]?.getBoundingClientRect();
      return first ? first.top - h.getBoundingClientRect().bottom : null;
    })(),
    itemPy: rowStyle?.paddingTop,
    itemFont: items[0] ? getComputedStyle(items[0]).fontSize : null,
    itemColor: items[0] ? getComputedStyle(items[0]).color : null,
    sectionBg: section ? getComputedStyle(section).backgroundColor : null,
    divider: dividers[0]
      ? { bg: getComputedStyle(dividers[0]).backgroundColor, h: getComputedStyle(dividers[0]).height }
      : null,
    faqCount: [...document.querySelectorAll('p')].filter((p) => p.textContent?.includes('?') && p.closest('footer') === null).length,
  };
}, refDom);

console.log(JSON.stringify(faq, null, 2));
await browser.close();
