'use client';

import {usePathname, useRouter} from 'next/navigation';
import {locales} from '@/i18n';

export default function LanguageSwitcher({locale}: {locale: string}) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(nextLocale: string) {
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  }

  return (
    <select
      value={locale}
      onChange={(event) => switchLocale(event.target.value)}
      className="rounded-md border border-fig-200 bg-white px-2 py-1 text-sm"
    >
      {locales.map((option) => (
        <option key={option} value={option}>
          {option === 'en' ? 'English' : '?????'}
        </option>
      ))}
    </select>
  );
}
