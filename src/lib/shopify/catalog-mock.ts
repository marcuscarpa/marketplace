export function isCatalogMockProduct(product: { id: string }): boolean {
  return product.id.startsWith('catalog-');
}

export function isCatalogMockVariantId(variantId: string): boolean {
  return /ProductVariant\/catalog-/i.test(variantId);
}
