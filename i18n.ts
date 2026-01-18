import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'mr'] as const;
export const defaultLocale = 'en';
export type Locale = typeof locales[number];

export default getRequestConfig(async ({locale}) => {
  const resolvedLocale = locales.includes(locale as Locale) ? locale : defaultLocale;
  return {
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
});
