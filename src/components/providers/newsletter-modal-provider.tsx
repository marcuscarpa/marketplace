'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export const NEWSLETTER_MODAL_STORAGE_KEY = 'newsletter-modal-dismissed';

interface NewsletterModalContextType {
  isOpen: boolean;
  openNewsletter: () => void;
  dismissNewsletter: () => void;
}

const NewsletterModalContext = createContext<NewsletterModalContextType | null>(null);

export function NewsletterModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openNewsletter = useCallback(() => setIsOpen(true), []);
  const dismissNewsletter = useCallback(() => {
    try {
      localStorage.setItem(NEWSLETTER_MODAL_STORAGE_KEY, '1');
    } catch {
      // ponytail: ignore quota errors
    }
    setIsOpen(false);
  }, []);

  return (
    <NewsletterModalContext.Provider value={{ isOpen, openNewsletter, dismissNewsletter }}>
      {children}
    </NewsletterModalContext.Provider>
  );
}

export function useNewsletterModal() {
  const context = useContext(NewsletterModalContext);
  if (!context) {
    throw new Error('useNewsletterModal must be used within a NewsletterModalProvider');
  }
  return context;
}
