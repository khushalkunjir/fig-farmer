import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale, type Locale} from '@/lib/locales';

export default getRequestConfig(async ({locale}) => {
  const resolvedLocale = locales.includes(locale as Locale) ? locale : defaultLocale;
  return {
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
});
