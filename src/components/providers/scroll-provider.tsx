'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Lenis from 'lenis';

interface ScrollContextType {
  scrollDirection: 'up' | 'down';
  scrollY: number;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let lastScrollY = 0;
    let ticking = false;

    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      setScrollDirection(scroll > lastScrollY ? 'down' : 'up');
      setScrollY(scroll);
      lastScrollY = scroll;
      ticking = false;
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollDirection, scrollY }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}