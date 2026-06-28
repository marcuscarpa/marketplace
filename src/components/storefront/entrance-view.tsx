'use client';

import { useInView } from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface EntranceViewProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** First paint (hero) vs scroll into view (sections). */
  mode?: 'mount' | 'scroll';
  /** Stagger children marked with `data-entrance-step`. */
  stagger?: boolean;
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Scroll/mount reveal — Alist-style `--in-view` toggle + CSS keyframes in globals.css. */
export function EntranceView({
  children,
  className = '',
  id,
  mode = 'scroll',
  stagger = false,
}: EntranceViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  useLayoutEffect(() => {
    if (mode !== 'mount') return undefined;
    if (prefersReducedMotion()) {
      queueMicrotask(() => setOn(true));
      return undefined;
    }
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setOn(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'scroll') return;
    if (inView) setOn(true);
  }, [inView, mode]);

  const rootClass = stagger ? 'mkt-entrance-stagger' : 'mkt-entrance';

  return (
    <div
      ref={ref}
      id={id}
      className={`${rootClass}${on ? ' mkt-entrance--in-view' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  );
}
