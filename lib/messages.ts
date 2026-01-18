import en from '@/messages/en.json';
import mr from '@/messages/mr.json';
import {Locale, defaultLocale} from '@/i18n';

export function getMessages(locale?: string) {
  if (locale === 'mr') return mr;
  return locale === 'en' ? en : locale ? en : en;
}

export function normalizeLocale(locale?: string): Locale {
  if (locale === 'mr') return 'mr';
  return defaultLocale;
}
