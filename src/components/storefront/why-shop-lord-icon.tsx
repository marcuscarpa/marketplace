'use client';

import { defineElement } from '@lordicon/element';
import { createElement } from 'react';

let lordIconElementDefined = false;

function ensureLordIconElement() {
  if (lordIconElementDefined) return;
  defineElement();
  lordIconElementDefined = true;
}

interface WhyShopLordIconProps {
  src: string;
  className?: string;
}

/** ALIST bloco7: Lordicon loop, stroke regular, ink #030607. */
export function WhyShopLordIcon({ src, className = '' }: WhyShopLordIconProps) {
  if (typeof window !== 'undefined') {
    ensureLordIconElement();
  }

  return (
    <div
      className={`flex h-[52px] w-[50px] items-center justify-center ${className}`}
      aria-hidden
    >
      {createElement('lord-icon', {
        src,
        trigger: 'loop',
        stroke: 'regular',
        colors: 'primary:#030607,secondary:#030607',
        style: { width: 50, height: 52, display: 'block' },
      })}
    </div>
  );
}
