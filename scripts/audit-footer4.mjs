import { designReferenceUrl, REF_SITE_COMPONENT_ATTR, REF_SITE_CLASS_TOKEN } from './lib/reference.mjs';
import { chromium } from 'playwright';

const URL = designReferenceUrl();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

const refDom = { a: REF_SITE_COMPONENT_ATTR, c: REF_SITE_CLASS_TOKEN };

const data = await page.evaluate(({ a, c }) => {
  const footer = document.querySelector('footer');
  const imgs = footer ? [...footer.querySelectorAll('img,svg')].map((el) => ({
    tag: el.tagName,
    alt: el.getAttribute('alt'),
    w: el.getBoundingClientRect().width,
    h: el.getBoundingClientRect().height,
  })) : [];

  const footerTexts = footer
    ? [...footer.querySelectorAll('p,h1,h2,h3,h4,span,div')].filter((el) => {
        const t = el.textContent?.trim() || '';
        return t.length > 0 && t.length < 100 && el.children.length === 0;
      }).map((el) => ({
        text: el.textContent.trim(),
        font: getComputedStyle(el).fontSize,
        color: getComputedStyle(el).color,
        fontFamily: getComputedStyle(el).fontFamily.slice(0, 30),
      }))
    : [];

  const faqItems = [...document.querySelectorAll(`[${a}], button, div`)].filter((el) => {
    const t = el.textContent?.trim() || '';
    return t === 'Is there wholesale opportunities?' || t.startsWith('Is there wholesale');
  });

  const faqRow = faqItems[0]?.closest(`[class*="${c}"]`) || faqItems[0]?.parentElement;
  const faqList = document.querySelector(`[class*="${c}-1edm1ik"]`); // guess

  const wholesaleEl = [...document.querySelectorAll('*')].find((el) =>
    el.textContent?.trim() === 'Is there wholesale opportunities?' && el.children.length === 0
  );
  const wholesaleRow = wholesaleEl?.parentElement;
  const wholesaleRowStyle = wholesaleRow ? getComputedStyle(wholesaleRow) : null;

  const plus = wholesaleRow?.querySelector('svg, span, div:last-child');

  const formLine = document.querySelector('input[type="email"]')?.closest('form') || document.querySelector('input[type="email"]')?.parentElement?.parentElement;

  return {
    imgs,
    footerTexts: footerTexts.slice(0, 20),
    wholesaleRow: wholesaleRowStyle
      ? {
          py: wholesaleRowStyle.paddingTop,
          borderTop: wholesaleRowStyle.borderTop,
          display: wholesaleRowStyle.display,
        }
      : null,
    plusText: plus?.textContent,
    formLineBorder: formLine ? getComputedStyle(formLine).borderBottom : null,
    formParent: (() => {
      const inp = document.querySelector('input[type="email"]');
      let p = inp?.parentElement;
      const chain = [];
      for (let i = 0; i < 4 && p; i++) {
        const s = getComputedStyle(p);
        chain.push({ borderBottom: s.borderBottom, bg: s.backgroundColor, class: p.className?.slice?.(0, 40) });
        p = p.parentElement;
      }
      return chain;
    })(),
    layout: (() => {
      const h4 = [...document.querySelectorAll('h4')].find((x) => /first to discover/i.test(x.textContent));
      const cols = [...document.querySelectorAll('p')].find((x) => x.textContent.trim() === 'SHOP');
      const copy = [...document.querySelectorAll('*')].find((x) => /^© 2026/.test(x.textContent?.trim() || ''));
      return {
        h4MaxW: h4 ? getComputedStyle(h4.parentElement || h4).maxWidth : null,
        h4w: h4?.getBoundingClientRect().width,
        colsTop: cols?.getBoundingClientRect().top,
        copyTop: copy?.getBoundingClientRect().top,
        footerH: footer?.getBoundingClientRect().height,
      };
    })(),
  };
}, refDom);

console.log(JSON.stringify(data, null, 2));
await browser.close();
