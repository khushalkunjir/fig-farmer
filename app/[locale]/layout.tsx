import '@/app/globals.css';
import {Merriweather, Noto_Serif_Devanagari} from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import Header from '@/components/Header';
import type {Locale} from '@/i18n';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather'
});

const devanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '700'],
  variable: '--font-devanagari'
});

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
      <body className={`${merriweather.variable} ${devanagari.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <Header locale={params.locale} />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
