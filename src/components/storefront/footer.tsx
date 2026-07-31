'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';

import { getFooterLinks, instagramHref, SITE_IMAGES } from '@/lib/catalog/data';
import type { SiteNavigation } from '@/lib/catalog/navigation-types';
import { m } from '@/lib/i18n';

import './footer.css';

interface FooterProps {
  locale: string;
  navigation: SiteNavigation;
}

function FooterMenuBlock({
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
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    if (window.innerWidth >= 768) return;
    setOpen((prev) => !prev);
  }, []);

  return (
    <div className="site-footer__menu-block">
      <h5
        id={titleId}
        className={`site-footer__menu-heading${open ? ' is-open' : ''}`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
      >
        {title}
      </h5>
      <ul
        aria-labelledby={titleId}
        className={`site-footer__menu${open ? ' is-open' : ''}`}
      >
        {links.map((link) => (
          <li key={link.href}>
            <Link href={`/${locale}/${link.href}`}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterForm({ locale }: { locale: string }) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const f = m(locale).footer;
  const c = m(locale).common;

  useEffect(() => setMounted(true), []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEmail('');
  }

  if (!mounted) {
    return (
      <div className="site-footer-newsletter__form" aria-hidden>
        <span className="site-footer-newsletter__input">{f.emailLabel}</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="site-footer-newsletter__form"
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
        placeholder={f.emailLabel}
        required
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        data-bwignore="true"
        className="site-footer-newsletter__input"
        aria-label={f.newsletterDescription}
      />
      <button type="submit" className="site-footer-newsletter__button">
        {c.subscribe}
      </button>
    </form>
  );
}

export function Footer({ locale }: FooterProps) {
  const f = m(locale).footer;
  const links = getFooterLinks(locale);

  const copyrightLinks = links.legal;

  const socialLinks = [{ label: 'Instagram', href: instagramHref(locale), external: true }];

  return (
    <footer className="site-footer">
      <div className="site-footer__background-image" aria-hidden>
        <img
          src={SITE_IMAGES.footerBackground}
          alt=""
          width={1800}
          height={1300}
          sizes="100vw"
          decoding="async"
        />
      </div>

      <div className="site-footer__outer">
        <div className="site-footer__d-flex">
          <div className="site-footer__container">
            <div className="site-footer__background-content">
              <div className="site-footer__top">
                {links.company.length > 0 ? (
                  <FooterMenuBlock
                    title={f.company}
                    titleId="footer-company"
                    links={links.company}
                    locale={locale}
                  />
                ) : null}
                <FooterMenuBlock
                  title={f.help}
                  titleId="footer-help"
                  links={links.others}
                  locale={locale}
                />
                <div className="site-footer__menu-block site-footer__menu-block--always-open">
                  <h5 id="footer-social" className="site-footer__menu-heading">
                    {f.social}
                  </h5>
                  <ul aria-labelledby="footer-social" className="site-footer__menu">
                    {socialLinks.map((link) => (
                      <li key={link.label}>
                        {link.external ? (
                          <a href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.label}
                          </a>
                        ) : (
                          <Link href={`/${locale}/${link.href}`}>{link.label}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="site-footer__newsletter">
                  <h5 className="site-footer__newsletter-heading">{f.newsletterTitle}</h5>
                  <div className="site-footer__newsletter-description">
                    {f.newsletterDescription}
                  </div>
                  <NewsletterForm locale={locale} />
                </div>
              </div>

              <div className="site-footer__copyright">
                <p className="site-footer__copyright-text">{f.copyright}</p>
                <ul className="site-footer__copyright-menu">
                  {copyrightLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={`/${locale}/${link.href}`}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
