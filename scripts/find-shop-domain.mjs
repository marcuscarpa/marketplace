const res = await fetch('https://sinesiakarol.com/');
const html = await res.text();
const domains = [...new Set([...html.matchAll(/([a-z0-9-]+)\.myshopify\.com/gi)].map((m) => m[0]))];
console.log('domains', domains);
const shop = html.match(/Shopify\.shop\s*=\s*"([^"]+)"/);
console.log('Shopify.shop', shop?.[1]);
const perm = html.match(/"permanent_domain":"([^"]+)"/);
console.log('permanent_domain', perm?.[1]);
