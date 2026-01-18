'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header({locale}: {locale: string}) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.endsWith('/login')) {
    return null;
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', {method: 'POST'});
    router.push(`/${locale}/login`);
  }

  const links = [
    {href: `/${locale}`, label: t('dashboard')},
    {href: `/${locale}/vendors`, label: t('vendors')},
    {href: `/${locale}/box-types`, label: t('boxTypes')},
    {href: `/${locale}/harvest`, label: t('harvest')},
    {href: `/${locale}/sales`, label: t('sales')},
    {href: `/${locale}/pending`, label: t('pending')},
    {href: `/${locale}/reports`, label: t('reports')}
  ];

  return (
    <header className="border-b border-fig-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <img src="/logo.png" alt={t('title')} className="h-11 w-11 rounded" />
            <div className="text-lg font-bold text-fig-800">{t('title')}</div>
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-fig-700 hover:text-fig-900">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <button onClick={handleLogout} className="btn btn-secondary">
            {t('logout')}
          </button>
        </div>
      </div>
    </header>
  );
}
