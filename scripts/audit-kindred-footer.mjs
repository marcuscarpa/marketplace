import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://kindredofireland.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(4000);

const data = await page.evaluate(() => {
  const footer = document.querySelector('.footer');
  const pick = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      class: el.className,
      rect: { w: r.width, h: r.height },
      font: s.fontFamily,
      fontSize: s.fontSize,
      lineHeight: s.lineHeight,
      fontWeight: s.fontWeight,
      color: s.color,
      bg: s.backgroundColor,
      padding: s.padding,
      margin: s.margin,
      gap: s.gap,
      backdropFilter: s.backdropFilter,
      display: s.display,
      flexDirection: s.flexDirection,
      justifyContent: s.justifyContent,
      alignItems: s.alignItems,
      position: s.position,
      opacity: s.opacity,
      border: s.border,
      textTransform: s.textTransform,
      letterSpacing: s.letterSpacing,
    };
  };
  const bgImg = document.querySelector('.footer__background img');
  const content = document.querySelector('.footer__background-content');
  const top = document.querySelector('.footer__top');
  const copyright = document.querySelector('.copyright');
  const menuBlocks = [...document.querySelectorAll('.footer__menu-block')].map((b) => ({
    heading: b.querySelector('.footer__menu-heading')?.textContent?.trim(),
    links: [...b.querySelectorAll('.footer__menu a')].map((a) => a.textContent.trim()),
    styles: pick(b),
  }));
  const newsletter = document.querySelector('.footer__newsletter');
  return {
    footerFound: !!footer,
    footer: pick(footer),
    bgImg: bgImg ? { src: bgImg.src, alt: bgImg.alt, ...pick(bgImg) } : null,
    bgWrap: pick(document.querySelector('.footer__background')),
    content: pick(content),
    top: pick(top),
    copyright: pick(copyright),
    copyrightText: pick(document.querySelector('.copyright__text')),
    copyrightMenu: pick(document.querySelector('.copyright__menu')),
    menuBlocks,
    newsletter: {
      heading: newsletter?.querySelector('.footer__newsletter-heading')?.textContent?.trim(),
      desc: newsletter?.querySelector('.footer__newsletter-description')?.textContent?.trim(),
      styles: pick(newsletter),
    },
    newsletterInput: pick(document.querySelector('.footer input[type=email], .klaviyo-form input')),
    newsletterBtn: pick(document.querySelector('.footer button, .klaviyo-form button')),
    cssLinks: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href).slice(-5),
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
