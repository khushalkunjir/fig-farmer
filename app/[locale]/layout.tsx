import '@/app/globals.css';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import Header from '@/components/Header';
import type {Locale} from '@/i18n';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: Locale};
}) {
  const messages = await getMessages({locale: params.locale});

  return (
    <html lang={params.locale}>
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header locale={params.locale} />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
