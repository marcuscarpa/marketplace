import { getMenuSections } from '@/lib/catalog/menu';
import { m } from '@/lib/i18n';

export const POPULAR_SEARCHES = {
  en: ['denim', 'bags', 'bracelets', 'women', 'accessories', 'new', 'sale'],
  pt: ['denim', 'bolsas', 'pulseiras', 'feminino', 'acessórios', 'novidades', 'sale'],
} as const;

export function getSearchCategories(locale: string) {
  return getMenuSections(locale).products.links.map((link) => ({
    label: link.label,
    href: `/${locale}/${link.href}`,
    query: link.href.split('/').pop() ?? link.label.toLowerCase(),
  }));
}

export function getSearchCopy(locale: string) {
  const t = m(locale);
  const isPt = locale === 'pt';
  return {
    placeholder: isPt ? 'Buscar produtos' : 'Search items',
    popular: isPt ? 'Buscas populares' : 'Popular searches',
    category: t.collection.category,
    items: isPt ? 'Itens' : 'Items',
    viewAll: t.common.seeAll,
    was: isPt ? 'Antes' : 'Was',
    now: isPt ? 'Agora' : 'Now',
    noResults: isPt ? 'Nenhum item encontrado' : 'No items found',
    searching: isPt ? 'Buscando…' : 'Searching…',
  };
}
