'use client';

import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const EASE = [0.33, 1, 0.68, 1] as const;

export function FadeIn({ children, className = '', delay = 0 }: FadeInProps) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  useEffect(() => setMounted(true), []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: '0.7em' }}
      animate={mounted && inView ? { opacity: 1, y: 0 } : { opacity: 0, y: '0.7em' }}
      transition={{ duration: 0.92, delay: delay + 0.15, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
