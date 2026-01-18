export const locales = ['en', 'mr'] as const;
export const defaultLocale = 'en';
export type Locale = typeof locales[number];
