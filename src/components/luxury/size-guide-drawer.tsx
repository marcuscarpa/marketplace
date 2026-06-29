'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';

const PANEL_EASE = [0.76, 0, 0.24, 1] as const;

const panelVariants = {
  closed: { x: '100%' },
  open: { x: 0, transition: { duration: 0.55, ease: PANEL_EASE } },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.35 } },
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;

const CONVERSION_ROWS = [
  ['Australia', '6', '8', '10', '12', '14'],
  ['UK', '6', '8', '10', '12', '14'],
  ['US', '2', '4', '6', '8', '10'],
  ['Brazil', '34', '36', '38', '40', '42'],
  ['Italy', '38', '40', '42', '44', '46'],
  ['France', '34', '36', '38', '40', '42'],
] as const;

const MEASUREMENT_ROWS = [
  {
    label: { en: 'Chest', pt: 'Busto' },
    cm: ['80-84', '86-90', '92-96', '98-102', '104-108'],
    inch: ['31-33', '34-35', '36-37', '38-40', '41-42.5'],
  },
  {
    label: { en: 'Waist', pt: 'Cintura' },
    cm: ['62-66', '68-72', '74-78', '80-84', '86-90'],
    inch: ['24-26', '27-28', '29-30', '31-33', '34-35.5'],
  },
  {
    label: { en: 'Hips', pt: 'Quadril' },
    cm: ['87-91', '93-97', '99-103', '105-109', '111-115'],
    inch: ['34-36', '37-38', '39-40', '41-43', '44-45.5'],
  },
] as const;

const copy = {
  en: {
    title: 'Size guide',
    close: 'Close',
    conversions: 'Clothing — Size Conversions',
    measurements: 'Clothing — Body Measurements',
    cm: 'CM',
    inch: 'INCH',
    country: 'Country',
    brazil: 'Brazil',
    size: 'Size',
  },
  pt: {
    title: 'Guia de tamanhos',
    close: 'Fechar',
    conversions: 'Vestuário — Conversão de tamanhos',
    measurements: 'Vestuário — Medidas corporais',
    brazil: 'Brasil',
    cm: 'CM',
    inch: 'POL',
    country: 'País',
    size: 'Tamanho',
  },
} as const;

function IconClose() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

interface SizeGuideDrawerProps {
  open: boolean;
  onClose: () => void;
  locale: string;
}

export function SizeGuideDrawer({ open, onClose, locale }: SizeGuideDrawerProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');
  const t = locale === 'pt' ? copy.pt : copy.en;
  const isPt = locale === 'pt';

  useEffect(() => setMounted(true), []);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95]" aria-hidden={!open}>
          <motion.button
            type="button"
            aria-label={t.close}
            className="absolute inset-0 bg-black/20"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed top-0 right-0 flex h-full w-full max-w-[480px] flex-col bg-white pl-2.5 pr-0 font-sans-ui text-[11px] font-light text-ink"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <button
              type="button"
              aria-label={t.close}
              onClick={onClose}
              className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center text-ink transition-opacity hover:opacity-60"
            >
              <IconClose />
            </button>

            <header className="shrink-0 border-b border-[#03060714] py-5 pl-2.5 pr-12">
              <h2 id={titleId} className="font-sans-ui text-[12px] uppercase tracking-[0.12em] text-ink">
                {t.title}
              </h2>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-[60px] pt-6 pl-2.5 pr-3">
              <section className="mb-10">
                <h3 className="mb-6 font-serif text-xl uppercase tracking-[0.06em] text-ink">{t.conversions}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[420px] border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-[#03060714] bg-cream">
                        <th scope="col" className="px-2 py-2 text-left font-normal uppercase tracking-[0.06em]">
                          {t.country}
                        </th>
                        {SIZES.map((size) => (
                          <th key={size} scope="col" className="px-2 py-2 text-left font-normal uppercase tracking-[0.06em]">
                            {size}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CONVERSION_ROWS.map(([country, ...values]) => (
                        <tr key={country} className="border-b border-[#03060714]">
                          <th scope="row" className="px-2 py-2 text-left font-normal">
                            {country === 'Brazil' ? t.brazil : country}
                          </th>
                          {values.map((value) => (
                            <td key={`${country}-${value}`} className="px-2 py-2">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <h3 className="font-serif text-xl uppercase tracking-[0.06em] text-ink">{t.measurements}</h3>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setUnit('cm')}
                      className={`border-b pb-px font-sans-ui text-[11px] uppercase tracking-[0.06em] transition-opacity ${
                        unit === 'cm' ? 'border-ink text-ink' : 'border-transparent text-[#03060799] hover:text-ink'
                      }`}
                    >
                      {t.cm}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('inch')}
                      className={`border-b pb-px font-sans-ui text-[11px] uppercase tracking-[0.06em] transition-opacity ${
                        unit === 'inch' ? 'border-ink text-ink' : 'border-transparent text-[#03060799] hover:text-ink'
                      }`}
                    >
                      {t.inch}
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px] border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-[#03060714] bg-cream">
                        <th scope="col" className="px-2 py-2 text-left font-normal uppercase tracking-[0.06em]">
                          {t.size}
                        </th>
                        {SIZES.map((size) => (
                          <th key={size} scope="col" className="px-2 py-2 text-left font-normal uppercase tracking-[0.06em]">
                            {size}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MEASUREMENT_ROWS.map((row) => (
                        <tr key={row.label.en} className="border-b border-[#03060714]">
                          <th scope="row" className="px-2 py-2 text-left font-normal">
                            {isPt ? row.label.pt : row.label.en}
                          </th>
                          {(unit === 'cm' ? row.cm : row.inch).map((value, i) => (
                            <td key={`${row.label.en}-${SIZES[i]}`} className="px-2 py-2 tabular-nums whitespace-nowrap">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
