import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const refDom = { a: REF_SITE_COMPONENT_ATTR };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(designReferenceUrl(), { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

const data = await page.evaluate(({ a }) => {
  const bottom = document.querySelector(`[${a}="Bottom"]`);
  const logoWrap = document.querySelector(`[${a}="Bottom"] [${a}="Logo"]`);
  const logoInner = logoWrap?.querySelector('div');

  const pick = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      w: r.width,
      h: r.height,
      bg: s.backgroundImage !== 'none' ? s.backgroundImage.slice(0, 150) : null,
      bgSize: s.backgroundSize,
      marginTop: s.marginTop,
    };
  };

  const colWrap = [...document.querySelectorAll('footer ol, footer ul, footer div')].find((el) => {
    const ps = [...el.querySelectorAll(':scope > div > p, :scope > p')];
    return ps.some((p) => p.textContent.trim() === 'Shop');
  });

  return {
    bottom: pick(bottom),
    logoWrap: pick(logoWrap),
    logoInner: pick(logoInner),
    colWrap: colWrap
      ? {
          ...pick(colWrap),
          cols: getComputedStyle(colWrap).gridTemplateColumns,
          gap: getComputedStyle(colWrap).gap,
        }
      : null,
    linkColGap: (() => {
      const shop = [...document.querySelectorAll('footer p')].find((p) => p.textContent.trim() === 'Shop');
      const company = [...document.querySelectorAll('footer p')].find((p) => p.textContent.trim() === 'Company');
      if (!shop || !company) return null;
      return company.getBoundingClientRect().left - shop.parentElement.getBoundingClientRect().right;
    })(),
    disclaimerToCols: (() => {
      const p = [...document.querySelectorAll('footer p')].find((x) => /submitting your email/i.test(x.textContent));
      const shop = [...document.querySelectorAll('footer p')].find((x) => x.textContent.trim() === 'Shop');
      if (!p || !shop) return null;
      return shop.getBoundingClientRect().top - p.getBoundingClientRect().bottom;
    })(),
    colsToBottom: (() => {
      const shop = [...document.querySelectorAll('footer p')].find((x) => x.textContent.trim() === 'Shop');
      const bottomEl = document.querySelector(`[${a}="Bottom"]`);
      if (!shop || !bottomEl) return null;
      const linksBottom = shop.closest('ol,ul,div')?.getBoundingClientRect().bottom;
      return bottomEl.getBoundingClientRect().top - linksBottom;
    })(),
  };
}, refDom);

console.log(JSON.stringify(data, null, 2));
await browser.close();
