import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import Header from '@/components/Header';
import type {Locale} from '@/lib/locales';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: Locale};
}) {
  const messages = await getMessages({locale: params.locale});

  return (
    <NextIntlClientProvider messages={messages}>
      <Header locale={params.locale} />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </NextIntlClientProvider>
  );
}
