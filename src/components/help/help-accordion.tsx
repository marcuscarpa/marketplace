'use client';

import { useId, useState } from 'react';

export interface HelpAccordionItem {
  title: string;
  content: React.ReactNode;
}

interface HelpAccordionProps {
  items: HelpAccordionItem[];
  defaultOpen?: boolean;
}

export function HelpAccordion({ items, defaultOpen = false }: HelpAccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<Record<number, boolean>>(() =>
    defaultOpen ? Object.fromEntries(items.map((_, i) => [i, true])) : {},
  );
  const [allOpen, setAllOpen] = useState(defaultOpen);

  function toggleAll() {
    const next = !allOpen;
    setAllOpen(next);
    setOpen(next ? Object.fromEntries(items.map((_, i) => [i, true])) : {});
  }

  function toggle(i: number) {
    setOpen((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      setAllOpen(items.every((_, idx) => next[idx]));
      return next;
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggleAll}
        className="mb-6 text-[11px] uppercase tracking-[0.12em] text-neutral-600 underline underline-offset-4 transition-opacity hover:opacity-60"
      >
        {allOpen ? 'Close All' : 'Open All'}
      </button>
      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {items.map((item, i) => {
          const isOpen = !!open[i];
          const panelId = `${baseId}-panel-${i}`;
          const triggerId = `${baseId}-trigger-${i}`;
          return (
            <section key={item.title}>
              <h3>
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-900"
                >
                  <span>{item.title}</span>
                  <span className="shrink-0 text-lg leading-none text-neutral-400" aria-hidden>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
              </h3>
              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="pb-6 text-sm leading-relaxed text-neutral-700 [&_a]:underline [&_li]:ml-4 [&_li]:list-disc [&_p+p]:mt-3 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-neutral-200 [&_td]:px-2 [&_td]:py-2 [&_td]:text-xs [&_th]:border [&_th]:border-neutral-200 [&_th]:bg-neutral-50 [&_th]:px-2 [&_th]:py-2 [&_th]:text-left [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-wider [&_ul]:mt-2 [&_ul]:space-y-1"
                >
                  {item.content}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
