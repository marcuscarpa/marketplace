'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { type FormEvent, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';

import { NEWSLETTER_MODAL_STORAGE_KEY, useNewsletterModal } from '@/components/providers/newsletter-modal-provider';
import { m } from '@/lib/i18n';

const MODAL_IMAGE = '/bloco 3.1.png';
const SHOW_DELAY_MS = 2500;

function IconClose({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function NewsletterModal({ locale }: { locale: string }) {
  const { isOpen, openNewsletter, dismissNewsletter } = useNewsletterModal();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const titleId = useId();
  const copy = m(locale).newsletterModal;
  const common = m(locale).common;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    try {
      if (localStorage.getItem(NEWSLETTER_MODAL_STORAGE_KEY)) return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => openNewsletter(), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [openNewsletter]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setEmail('');
    dismissNewsletter();
  };

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissNewsletter();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, dismissNewsletter]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="newsletter-modal"
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 pb-8 pt-16 sm:px-6 sm:pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label={common.close}
            className="absolute inset-0 bg-[#030607]/60"
            onClick={dismissNewsletter}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-[600px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <button
              type="button"
              onClick={dismissNewsletter}
              aria-label={copy.closeModal}
              className="absolute right-0 top-[-44px] z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.08] text-white transition-opacity hover:opacity-80"
            >
              <IconClose className="h-3 w-3" />
            </button>

            <div className="relative min-h-[480px] overflow-hidden sm:min-h-[560px]">
              <Image
                src={MODAL_IMAGE}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 600px"
                className="object-cover object-center"
                priority
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(50% 50%, rgba(3, 6, 7, 0.28) 0%, rgba(3, 6, 7, 0.16) 100%)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(3, 6, 7, 0.85) 0%, rgba(3, 6, 7, 0.35) 55%, rgba(3, 6, 7, 0) 100%)',
                }}
              />

              <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 pt-16 text-center sm:px-10 sm:pb-10">
                <p className="mb-3 font-sans-ui text-[15px] font-normal leading-[1.33] text-white/80">
                  {copy.subtitle}
                </p>
                <h2
                  id={titleId}
                  className="mb-8 font-sans-ui text-[26px] font-normal leading-[1.15] tracking-[-0.02em] text-white sm:text-[32px]"
                >
                  {copy.title}
                </h2>

                <form
                  onSubmit={onSubmit}
                  className="mx-auto w-full max-w-[360px] border-b border-white/20"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-bwignore="true"
                  data-form-type="other"
                >
                  <label className="block w-full">
                    <input
                      type="email"
                      name="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={copy.emailPlaceholder}
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-bwignore="true"
                      className="w-full border border-white/20 bg-[#030607]/60 px-4 py-3.5 font-sans-ui text-[15px] text-white outline-none placeholder:text-white/80 focus:border-white/40"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full bg-white py-4 font-sans-ui text-[15px] font-normal text-[#030607] transition-opacity hover:opacity-90"
                  >
                    {copy.submit}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
