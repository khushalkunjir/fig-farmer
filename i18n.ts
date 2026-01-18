import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from '@/lib/locales';

export default getRequestConfig(async ({locale}) => {
  const resolvedLocale = locales.includes(locale as (typeof locales)[number]) ? locale : defaultLocale;
  return {
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
});
