'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

import { FOOTER_LINKS } from '@/lib/catalog/data';

interface FooterProps {
  locale: string;
}

const MENU_COLUMNS = [
  ['Shop', FOOTER_LINKS.shop],
  ['Company', FOOTER_LINKS.company],
  ['Customer Service', FOOTER_LINKS.others],
] as const;

const LEGAL_LINKS = FOOTER_LINKS.legal;

const INSTAGRAM_HREF = {
  pt: 'https://www.instagram.com/sinesiakarol/',
  en: 'https://www.instagram.com/sinesiakarolusa?igsh=MXF3dmUxcGE2YzRhZw==',
} as const;

function instagramHref(locale: string) {
  return locale === 'pt' ? INSTAGRAM_HREF.pt : INSTAGRAM_HREF.en;
}

function SocialIcon({ icon }: { icon: 'instagram' }) {
  if (icon !== 'instagram') return null;

  const props = { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true as const };

  return (
    <svg {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
    </svg>
  );
}

function FooterColumn({
  title,
  titleId,
  links,
  locale,
}: {
  title: string;
  titleId: string;
  links: readonly { label: string; href: string }[];
  locale: string;
}) {
  return (
    <div>
      <h2 id={titleId} className="mb-0.5 font-sans-ui text-[15px] font-bold leading-[1.33] text-ink">
        {title}
      </h2>
      <ul aria-labelledby={titleId} className="flex flex-col gap-0.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={`/${locale}/${link.href}`}
              className="font-sans-ui text-[15px] leading-[1.33] text-ink transition-opacity hover:opacity-60"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterBox() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => setMounted(true), []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEmail('');
  }

  // ponytail: defer real input until after hydration — LastPass injects nodes into email fields pre-hydration
  if (!mounted) {
    return (
      <div className="mt-3" aria-hidden>
        <p className="mb-2 font-sans-ui text-[15px] font-bold leading-[1.33] text-ink">Stay in the loop</p>
        <div className="flex flex-col gap-2">
          <div className="rounded border border-[#e6e6e6] bg-white px-3 py-2.5">
            <span className="font-sans-ui text-[15px] text-ink/40">Enter your email</span>
          </div>
          <div className="rounded bg-ink py-2.5 text-center font-sans-ui text-[15px] font-bold text-white">
            Subscribe
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <h2 className="mb-2 font-sans-ui text-[15px] font-bold leading-[1.33] text-ink">Stay in the loop</h2>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-2"
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        data-bwignore="true"
        data-form-type="other"
      >
        <input
          type="email"
          name="newsletter"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          data-bwignore="true"
          className="w-full rounded border border-[#e6e6e6] bg-white px-3 py-2.5 font-sans-ui text-[15px] text-ink outline-none placeholder:text-ink/40 focus:border-ink/30"
        />
        <button
          type="submit"
          className="w-full rounded bg-ink py-2.5 font-sans-ui text-[15px] font-bold text-white transition-opacity hover:opacity-80"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-cream text-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-[30px] lg:px-5">
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-4">
          {MENU_COLUMNS.map(([title, links], index) => (
            <FooterColumn key={title} title={title} titleId={`footer-${index}`} links={links} locale={locale} />
          ))}

          <div>
            <h2 id="footer-socials" className="mb-0.5 font-sans-ui text-[15px] font-bold leading-[1.33] text-ink">
              Follow us
            </h2>
            <ul aria-labelledby="footer-socials" className="flex items-center gap-1.5">
              <li>
                <a
                  href={instagramHref(locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className="inline-flex text-ink transition-opacity hover:opacity-60"
                >
                  <SocialIcon icon="instagram" />
                </a>
              </li>
            </ul>
            <NewsletterBox />
          </div>
        </nav>

        <hr className="mt-3 border-0 border-t border-[#e6e6e6]" />

        <div className="pt-1.5">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={`/${locale}/${link.href}`}
                  className="font-sans-ui text-[15px] leading-[1.33] text-ink underline underline-offset-2 transition-opacity hover:opacity-60"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-1.5 font-sans-ui text-[13px] leading-[1.31] text-ink/60">
            © 2026 SINESIA KAROL. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
