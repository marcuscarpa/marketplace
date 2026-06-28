import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const url = 'https://www.zimmermann.com/us/checkout/cart/';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

// Dismiss cookie/consent if present
for (const sel of ['button:has-text("Accept")', 'button:has-text("Continue")', '#onetrust-accept-btn-handler']) {
  const btn = page.locator(sel).first();
  if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await btn.click().catch(() => {});
    break;
  }
}

await page.waitForTimeout(2000);

const data = await page.evaluate(() => {
  const pick = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      className: el.className?.toString?.() ?? '',
      id: el.id || null,
      text: (el.textContent || '').trim().slice(0, 120),
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      letterSpacing: cs.letterSpacing,
      textTransform: cs.textTransform,
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      padding: cs.padding,
      margin: cs.margin,
      border: cs.border,
      width: Math.round(r.width),
      height: Math.round(r.height),
      maxWidth: cs.maxWidth,
    };
  };

  const main =
    document.querySelector('.cart-container') ||
    document.querySelector('.checkout-cart-index') ||
    document.querySelector('main') ||
    document.querySelector('#maincontent');

  const title = document.querySelector('h1');
  const emptyMsg = [...document.querySelectorAll('p, div, span')].find((el) =>
    /no items in your bag/i.test(el.textContent || '')
  );

  const continueLink = [...document.querySelectorAll('a')].find((el) =>
    /continue shopping/i.test(el.textContent || '')
  );

  const cartTable = document.querySelector('.cart.table-wrapper, .cart, table.cart');
  const summary = document.querySelector('.cart-summary, .cart-totals, .checkout-summary');

  const selectors = [
    'h1',
    '.page-title',
    '.cart-empty',
    '.cart-summary',
    '.cart-totals',
    '.action.primary.checkout',
    '.checkout',
    'button.checkout',
    '.cart.item',
    '.product-item-name',
    '.cart-price',
    '.qty',
    '.subtotal',
    '.grand.totals',
  ];

  const found = {};
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) found[sel] = pick(el);
  }

  return {
    url: location.href,
    title: document.title,
    main: pick(main),
    h1: pick(title),
    emptyMsg: pick(emptyMsg),
    continueLink: pick(continueLink),
    cartTable: pick(cartTable),
    summary: pick(summary),
    found,
    htmlSnippet: main?.outerHTML?.slice(0, 8000) ?? null,
    bodyClasses: document.body.className,
  };
});

await page.screenshot({ path: 'scripts/zimmermann-cart.png', fullPage: true });
writeFileSync('scripts/zimmermann-cart-inspect.json', JSON.stringify(data, null, 2));

console.log(JSON.stringify(data, null, 2));
await browser.close();
