import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const URL = designReferenceUrl();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

const data = await page.evaluate(() => {
  const footer = document.querySelector('footer');
  const fs = footer ? getComputedStyle(footer) : null;

  const faqBtn = [...document.querySelectorAll('button')].find((b) =>
    /wholesale/i.test(b.textContent)
  );

  const links = footer
    ? [...footer.querySelectorAll('a')].slice(0, 8).map((a) => {
        const s = getComputedStyle(a);
        return { text: a.textContent.trim(), color: s.color, fontSize: s.fontSize };
      })
    : [];

  const bigText = [...document.querySelectorAll('h1,h2,h3,h4,p,div')].filter((el) => {
    const s = getComputedStyle(el);
    const fs = parseFloat(s.fontSize);
    return fs > 100 && el.textContent.trim().length < 20;
  });

  const logoEl = bigText[0];
  const logo = logoEl
    ? {
        text: logoEl.textContent.trim(),
        font: getComputedStyle(logoEl).fontSize,
        color: getComputedStyle(logoEl).color,
        opacity: getComputedStyle(logoEl).opacity,
        h: logoEl.getBoundingClientRect().height,
      }
    : null;

  const formWrap = document.querySelector('input[type="email"]')?.parentElement;
  const formRect = formWrap?.getBoundingClientRect();

  return {
    footerBg: fs?.backgroundColor,
    footerColor: fs?.color,
    footerPadding: fs ? `${fs.paddingTop} ${fs.paddingLeft}` : null,
    faqBtn: faqBtn
      ? {
          py: getComputedStyle(faqBtn).paddingTop,
          font: getComputedStyle(faqBtn).fontSize,
          border: getComputedStyle(faqBtn.parentElement?.parentElement).borderTop,
        }
      : null,
    links,
    logo,
    formWidth: formRect?.width,
    gapNewsletterToForm: (() => {
      const h = [...document.querySelectorAll('h4')].find((x) => /first to discover/i.test(x.textContent));
      const inp = document.querySelector('input[type="email"]');
      if (!h || !inp) return null;
      return inp.getBoundingClientRect().top - h.getBoundingClientRect().bottom;
    })(),
    gapFormToDisclaimer: (() => {
      const inp = document.querySelector('input[type="email"]');
      const p = [...document.querySelectorAll('p')].find((x) => /submitting your email/i.test(x.textContent));
      if (!inp || !p) return null;
      return p.getBoundingClientRect().top - inp.getBoundingClientRect().bottom;
    })(),
    gapDisclaimerToCols: (() => {
      const p = [...document.querySelectorAll('p')].find((x) => /submitting your email/i.test(x.textContent));
      const shop = [...document.querySelectorAll('p')].find((x) => x.textContent.trim() === 'SHOP');
      if (!p || !shop) return null;
      return shop.getBoundingClientRect().top - p.getBoundingClientRect().bottom;
    })(),
    gapColsToCopyright: (() => {
      const shop = [...document.querySelectorAll('p')].find((x) => x.textContent.trim() === 'SHOP');
      const copy = [...document.querySelectorAll('*')].find((x) => /© 2026/i.test(x.textContent) && x.textContent.length < 60);
      if (!shop || !copy) return null;
      return copy.getBoundingClientRect().top - (shop.parentElement?.getBoundingClientRect().bottom ?? 0);
    })(),
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
