import { readFileSync } from 'node:fs';

const h = readFileSync(process.argv[2] ?? 'tmp-og.html', 'utf8');
const headEnd = h.indexOf('</head>');
const head = headEnd > 0 ? h.slice(0, headEnd) : h.slice(0, 8000);
for (const re of [
  /property="og:image" content="([^"]+)"/g,
  /name="twitter:image" content="([^"]+)"/g,
  /rel="shortcut icon" href="([^"]+)"/g,
  /rel="apple-touch-icon" href="([^"]+)"/g,
]) {
  for (const m of head.matchAll(re)) console.log(m[0]);
}
console.log('og:inHead', /property="og:image"/.test(head));
