'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';

import { useScroll } from '@/components/providers';
import { getFooterLinks, instagramHref, SITE_IMAGES } from '@/lib/catalog/data';
import type { SiteNavigation } from '@/lib/catalog/navigation-types';
import { m } from '@/lib/i18n';

interface FooterProps {
  locale: string;
  navigation: SiteNavigation;
}

const FOOTER_SCENE_HEIGHT = 650;
const FOOTER_SCENE_HEIGHT_MOBILE = 872;
const PANEL_VIEWPORT_GAP = 32;
const MIN_IMAGE_ABOVE = 32;

function FooterMenuBlock({
  title,
  titleId,
  links,
  locale,
  external = false,
}: {
  title: string;
  titleId: string;
  links: readonly { label: string; href: string }[];
  locale: string;
  external?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="site-footer__menu-block">
      <h5
        id={titleId}
        className={`site-footer__menu-heading${open ? ' is-open' : ''}`}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={`${titleId}-menu`}
      >
        {title}
      </h5>
      <ul
        id={`${titleId}-menu`}
        aria-labelledby={titleId}
        className={`site-footer__menu${open ? ' is-open' : ''}`}
      >
        {links.map((link) => (
          <li key={link.href}>
            {external ? (
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
  );
}

function NewsletterForm({ locale }: { locale: string }) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const f = m(locale).footer;
  const c = m(locale).common;

  useEffect(() => setMounted(true), []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setEmail('');
  }

  if (!mounted) {
    return (
      <div className="site-footer-newsletter__form" aria-hidden>
        <div className="site-footer-newsletter__input">{c.emailPlaceholder}</div>
        <div className="site-footer-newsletter__button">{c.subscribe}</div>
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
        onChange={(event) => setEmail(event.target.value)}
        placeholder={c.emailPlaceholder}
        required
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        data-bwignore="true"
        className="site-footer-newsletter__input"
        aria-label={f.stayInLoop}
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
  const socialLinks = [{ label: 'Instagram', href: instagramHref(locale) }];
  const copyrightLinks = links.legal.slice(0, 3);
  const { scrollY } = useScroll();
  const footerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelOffset, setPanelOffset] = useState(MIN_IMAGE_ABOVE);

  const updatePanelOffset = useCallback(() => {
    const footer = footerRef.current;
    const container = containerRef.current;
    if (!footer || !container) return;

    const footerRect = footer.getBoundingClientRect();
    const panelHeight = container.offsetHeight;
    const sceneHeight =
      window.innerWidth <= 767 ? FOOTER_SCENE_HEIGHT_MOBILE : FOOTER_SCENE_HEIGHT;
    const maxImageAbove = Math.max(MIN_IMAGE_ABOVE, sceneHeight - panelHeight - MIN_IMAGE_ABOVE);
    const targetPanelTop = window.innerHeight - panelHeight - PANEL_VIEWPORT_GAP;
    const imageAbove = Math.max(
      MIN_IMAGE_ABOVE,
      Math.min(maxImageAbove, targetPanelTop - footerRect.top),
    );

    setPanelOffset((current) => (current === imageAbove ? current : imageAbove));
  }, []);

  useEffect(() => {
    updatePanelOffset();
  }, [scrollY, updatePanelOffset]);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    let frame = 0;
    let active = false;

    const loop = () => {
      updatePanelOffset();
      if (active) frame = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry?.isIntersecting ?? false;
        if (active) {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(frame);
          updatePanelOffset();
        }
      },
      { threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] },
    );

    observer.observe(footer);
    window.addEventListener('resize', updatePanelOffset);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', updatePanelOffset);
    };
  }, [updatePanelOffset]);

  return (
    <footer ref={footerRef} className="site-footer">
      <div className="site-footer__background-image" aria-hidden>
        <Image
          src={SITE_IMAGES.footerBackground}
          alt=""
          fill
          sizes="100vw"
          className="animate-fade-in object-cover"
          priority={false}
        />
      </div>

      <div className="site-footer__outer">
        <div className="site-footer__d-flex">
          <div
            ref={containerRef}
            className="site-footer__container"
            style={{ marginTop: panelOffset }}
          >
            <div className="site-footer__background-content">
              <nav aria-label="Footer" className="site-footer__top">
                <FooterMenuBlock title={f.company} titleId="footer-company" links={links.company} locale={locale} />
                <FooterMenuBlock
                  title={f.customerService}
                  titleId="footer-help"
                  links={links.others}
                  locale={locale}
                />
                <FooterMenuBlock
                  title={f.followUs}
                  titleId="footer-social"
                  links={socialLinks}
                  locale={locale}
                  external
                />

                <div className="site-footer__newsletter">
                  <h5 className="site-footer__newsletter-heading">{f.stayInLoop}</h5>
                  <p className="site-footer__newsletter-description">{f.newsletterDescription}</p>
                  <NewsletterForm locale={locale} />
                </div>
              </nav>

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
