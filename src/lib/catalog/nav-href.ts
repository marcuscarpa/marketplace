export function resolveNavHref(locale: string, href: string): string {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }
  return `/${locale}/${href}`;
}
