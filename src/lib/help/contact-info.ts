export const CONTACT_EMAIL = 'business@sinesiakarol.com';

export interface ContactPhone {
  display: string;
  href: string;
  labelEn: string;
  labelPt: string;
}

/** General customer service contact numbers. */
export const CONTACT_PHONES = {
  us: {
    display: '+1 (401) 847-1087',
    href: 'tel:+14018471087',
    labelEn: 'US',
    labelPt: 'EUA',
  },
  br: {
    display: '(27) 99929-8844',
    href: 'tel:+5527999298844',
    labelEn: 'Brazil',
    labelPt: 'Brasil',
  },
  angra: {
    display: '(24) 99819-6050',
    href: 'tel:+5524998196050',
    labelEn: 'Angra dos Reis',
    labelPt: 'Angra dos Reis',
  },
  trancoso: {
    display: '(73) 99950-4425',
    href: 'tel:+5573999504425',
    labelEn: 'Trancoso',
    labelPt: 'Trancoso',
  },
} as const satisfies Record<string, ContactPhone>;

export const ALL_CONTACT_PHONES = [
  CONTACT_PHONES.us,
  CONTACT_PHONES.br,
  CONTACT_PHONES.angra,
  CONTACT_PHONES.trancoso,
] as const;
