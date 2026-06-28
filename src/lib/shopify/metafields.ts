import { ShopifyProduct, LuxuryMetafields } from './types';

function parseMaterials(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed;
    }
    if (typeof parsed === 'string') {
      return [parsed];
    }
    throw new Error('Invalid materials format');
  } catch {
    return [value];
  }
}

function parseNumber(value: string, min: number, max: number): number | undefined {
  const num = parseFloat(value);
  if (!isNaN(num) && num >= min && num <= max) {
    return num;
  }
  return undefined;
}

function parseIntSafe(value: string, min: number): number | undefined {
  const num = parseInt(value, 10);
  if (!isNaN(num) && num >= min) {
    return num;
  }
  return undefined;
}

export function parseLuxuryMetafields(
  productMetafields: ShopifyProduct['metafields']
): LuxuryMetafields {
  const metafieldsMap = new Map<string, { value: string; type: string }>();

  if (Array.isArray(productMetafields)) {
    productMetafields.forEach((m) => {
      if (!m) return;
      const fullKey = `${m.namespace}.${m.key}`;
      metafieldsMap.set(fullKey, { value: m.value, type: m.type });
    });
  }

  const getFieldValue = (key: string) => metafieldsMap.get(key)?.value;

  return {
    certificateHash: getFieldValue('luxury.certificate_hash'),
    materials: (() => {
      const v = getFieldValue('luxury.materials');
      return v ? parseMaterials(v) : undefined;
    })(),
    madeIn: getFieldValue('luxury.made_in'),
    video360Url: getFieldValue('luxury.video_360_url'),
    limitedEditionNumber: (() => {
      const v = getFieldValue('luxury.limited_edition_number');
      return v ? parseIntSafe(v, 0) : undefined;
    })(),
    careInstructions: getFieldValue('luxury.care_instructions'),
    averageRating: (() => {
      const v = getFieldValue('reviews.average_rating');
      return v ? parseNumber(v, 0, 5) : undefined;
    })(),
    totalReviews: (() => {
      const v = getFieldValue('reviews.total_reviews');
      return v ? parseIntSafe(v, 0) : undefined;
    })(),
  };
}