import { describe, it, expect } from 'vitest';

import {
  defaultSelectedOptions,
  findMatchingVariant,
  sortProductOptions,
} from '@/lib/shopify/variants';

describe('product variants', () => {
  it('sorts color before size', () => {
    const sorted = sortProductOptions([
      { name: 'Size', values: ['38'] },
      { name: 'Color', values: ['Pecan'] },
    ]);
    expect(sorted.map((o) => o.name)).toEqual(['Color', 'Size']);
  });

  it('finds variant by selected options', () => {
    const variants = [
      {
        id: 'v1',
        price: { amount: '895' },
        selectedOptions: [
          { name: 'Color', value: 'Pecan' },
          { name: 'Size', value: '38' },
        ],
      },
    ];
    expect(findMatchingVariant(variants, { Color: 'Pecan', Size: '38' })?.id).toBe('v1');
  });

  it('defaults to first value per option', () => {
    expect(
      defaultSelectedOptions([
        { name: 'Color', values: ['Pecan', 'Milk'] },
        { name: 'Size', values: ['36', '37'] },
      ])
    ).toEqual({ Color: 'Pecan', Size: '36' });
  });
});
