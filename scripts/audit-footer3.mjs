import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const URL = designReferenceUrl();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 1200));

const data = await page.evaluate(() => {
  const all = [...document.querySelectorAll('*')].map((el) => {
    const s = getComputedStyle(el);
    const fs = parseFloat(s.fontSize);
    const t = (el.textContent || '').trim();
    if (t.length > 30 || t.length === 0) return null;
    if (el.children.length > 2) return null;
    const r = el.getBoundingClientRect();
    if (r.height < 50) return null;
    return {
      tag: el.tagName,
      text: t.slice(0, 40),
      fontSize: s.fontSize,
      color: s.color,
      h: r.height,
      w: r.width,
      y: r.top + scrollY,
    };
  }).filter(Boolean);

  const faqSection = [...document.querySelectorAll('h3')].find((h) => /faq/i.test(h.textContent));
  const faqWrap = faqSection?.closest('section') || faqSection?.parentElement?.parentElement;
  const fws = faqWrap ? getComputedStyle(faqWrap) : null;

  const input = document.querySelector('input[type="email"]');
  const inputStyle = input ? getComputedStyle(input) : null;
  const inputWrap = input?.parentElement;
  const inputWrapStyle = inputWrap ? getComputedStyle(inputWrap) : null;

  const submit = [...document.querySelectorAll('button')].find((b) => /submit/i.test(b.textContent));
  const submitStyle = submit ? getComputedStyle(submit) : null;

  const copy = [...document.querySelectorAll('*')].find((el) => {
    const t = el.textContent?.trim() || '';
    return /^©/.test(t) && t.length < 80 && el.children.length === 0;
  });

  return {
    faqSectionBg: fws?.backgroundColor,
    faqSectionPadding: fws ? `${fws.paddingTop} ${fws.paddingBottom}` : null,
    largeTexts: all.filter((x) => parseFloat(x.fontSize) >= 80).sort((a, b) => parseFloat(b.fontSize) - parseFloat(a.fontSize)),
    input: inputStyle
      ? {
          bg: inputStyle.backgroundColor,
          border: inputStyle.border,
          borderBottom: inputStyle.borderBottom,
          height: inputStyle.height,
          color: inputStyle.color,
        }
      : null,
    inputWrap: inputWrapStyle
      ? { display: inputWrapStyle.display, border: inputWrapStyle.border, borderBottom: inputWrapStyle.borderBottom }
      : null,
    submit: submitStyle
      ? {
          bg: submitStyle.backgroundColor,
          color: submitStyle.color,
          text: submit?.textContent,
          width: submit?.getBoundingClientRect().width,
        }
      : null,
    copyright: copy
      ? {
          text: copy.textContent.trim(),
          color: getComputedStyle(copy).color,
          fontSize: getComputedStyle(copy).fontSize,
        }
      : null,
    colGap: (() => {
      const headers = [...document.querySelectorAll('p')].filter((p) =>
        ['SHOP', 'COMPANY', 'OTHERS', 'LEGAL'].includes(p.textContent.trim())
      );
      if (headers.length < 2) return null;
      return headers[1].getBoundingClientRect().left - headers[0].getBoundingClientRect().right;
    })(),
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
