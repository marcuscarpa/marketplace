'use client';

import { useEffect } from 'react';

import { localeTag } from '@/lib/i18n';

/** Sets `<html lang>` from locale segment (`pt` → `pt-BR`). */
export function LocaleHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = localeTag(locale);
  }, [locale]);

  return null;
}
