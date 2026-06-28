'use client';

import type { ShopifyProductOption } from '@/lib/shopify/types';
import { colorSwatchHex, isColorOption, isSizeOption } from '@/lib/shopify/variants';

interface ProductVariantPickerProps {
  options: ShopifyProductOption[];
  selected: Record<string, string>;
  onSelect: (optionName: string, value: string) => void;
  locale: string;
}

const labels = {
  en: { color: 'Color', size: 'Size', findMySize: 'Find my size', sizeGuide: 'Size guide' },
  pt: { color: 'Cor', size: 'Tamanho', findMySize: 'Encontrar meu tamanho', sizeGuide: 'Guia de tamanhos' },
} as const;

function ColorSwatches({
  option,
  selected,
  onSelect,
}: {
  option: ShopifyProductOption;
  selected: Record<string, string>;
  onSelect: (optionName: string, value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-6">
      {option.values.map((value) => {
        const isSelected = selected[option.name] === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(option.name, value)}
            aria-pressed={isSelected}
            className="group flex flex-col items-center gap-2"
          >
            <span
              className={`h-8 w-8 rounded-full border transition-all ${
                isSelected
                  ? 'ring-1 ring-neutral-900 ring-offset-2'
                  : 'border-neutral-300 group-hover:border-neutral-500'
              }`}
              style={{ backgroundColor: colorSwatchHex(value) }}
            />
            <span
              className={`text-[10px] uppercase tracking-[0.15em] ${
                isSelected ? 'text-neutral-900' : 'text-neutral-400'
              }`}
            >
              {value}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SizeButtons({
  option,
  selected,
  onSelect,
  locale,
}: {
  option: ShopifyProductOption;
  selected: Record<string, string>;
  onSelect: (optionName: string, value: string) => void;
  locale: string;
}) {
  const copy = locale === 'pt' ? labels.pt : labels.en;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {option.values.map((value) => {
          const isSelected = selected[option.name] === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(option.name, value)}
              aria-pressed={isSelected}
              className={`min-w-[3rem] px-3 py-3 text-sm transition-colors ${
                isSelected
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end gap-3 text-[10px] uppercase tracking-[0.15em] text-neutral-500">
        <button type="button" className="transition-colors hover:text-neutral-900">
          {copy.findMySize}
        </button>
        <span aria-hidden="true">|</span>
        <button type="button" className="transition-colors hover:text-neutral-900">
          {copy.sizeGuide}
        </button>
      </div>
    </>
  );
}

/** Color always renders above size. */
export function ProductVariantPicker({
  options,
  selected,
  onSelect,
  locale,
}: ProductVariantPickerProps) {
  const copy = locale === 'pt' ? labels.pt : labels.en;
  const colorOption = options.find((o) => isColorOption(o.name));
  const sizeOption = options.find((o) => isSizeOption(o.name));
  const otherOptions = options.filter((o) => !isColorOption(o.name) && !isSizeOption(o.name));

  if (!colorOption && !sizeOption && otherOptions.length === 0) return null;

  return (
    <div className="space-y-8">
      {colorOption && (
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-900">
            {copy.color}
          </p>
          <ColorSwatches option={colorOption} selected={selected} onSelect={onSelect} />
        </div>
      )}

      {sizeOption && (
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-900">
            {copy.size}
          </p>
          <SizeButtons
            option={sizeOption}
            selected={selected}
            onSelect={onSelect}
            locale={locale}
          />
        </div>
      )}

      {otherOptions.map((option) => (
        <div key={option.name} className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-900">
            {option.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selected[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSelect(option.name, value)}
                  aria-pressed={isSelected}
                  className={`border px-4 py-2 text-sm transition-colors ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 text-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
