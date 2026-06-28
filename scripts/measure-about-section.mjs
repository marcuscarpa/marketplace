import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const refDom = { a: REF_SITE_COMPONENT_ATTR };

const b = await chromium.launch();
for (const [w, h, label] of [
  [768, 1024, 'tablet'],
  [1440, 900, 'desktop'],
  [390, 844, 'mobile'],
]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(designReferenceUrl(), { waitUntil: 'networkidle' });
  const d = await p.evaluate(({ a }) => {
    const h3 = [...document.querySelectorAll('h3')].find((h) => /^about us$/i.test(h.textContent?.trim() || ''));
    h3?.scrollIntoView({ block: 'center' });
    const section = h3?.closest('section');
    const img = section?.querySelector('img');
    const wrapper = [...(section?.querySelectorAll(`[${a}]`) || [])].find(
      (el) => el.getAttribute(a) === 'Wrapper' && !el.querySelector('img')
    );
    const storyLink = [...(section?.querySelectorAll('a') || [])].find((x) => /our story/i.test(x.textContent || ''));
    const line = storyLink?.querySelector(`[${a}="Line"]`);
    const m = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        display: s.display,
        flexDir: s.flexDirection,
        pad: s.padding,
        bg: s.backgroundColor,
        radius: s.borderRadius,
        gap: s.gap,
      };
    };
    const desc = section?.querySelector('p');
    return {
      section: m(section),
      imgWrap: m(img?.closest(`[${a}="Image"]`) || img?.parentElement?.parentElement),
      wrapper: m(wrapper),
      h3: h3 && { fs: getComputedStyle(h3).fontSize, lh: getComputedStyle(h3).lineHeight },
      desc: desc && {
        t: desc.textContent?.slice(0, 60),
        fs: getComputedStyle(desc).fontSize,
        color: getComputedStyle(desc).color,
        mb: getComputedStyle(desc).marginBottom,
      },
      story: storyLink && {
        text: storyLink.textContent?.trim(),
        fs: getComputedStyle(storyLink.querySelector('p') || storyLink).fontSize,
      },
      line: line && { h: Math.round(line.getBoundingClientRect().height), bg: getComputedStyle(line).backgroundColor },
    };
  }, refDom);
  console.log(label, JSON.stringify(d, null, 2));
  await p.close();
}
await b.close();
