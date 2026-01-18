'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LoginPage({params}: {params: {locale: string}}) {
  const t = useTranslations('login');
  const common = useTranslations('common');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setIsSignup(!data.hasAdmin);
      setLoading(false);
    }
    checkAdmin();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    const payload = isSignup
      ? identifier.includes('@')
        ? {email: identifier, password}
        : {username: identifier, password}
      : {identifier, password};

    const res = await fetch(isSignup ? '/api/auth/signup' : '/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      setError(t('error'));
      return;
    }

    window.location.href = `/${params.locale}`;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col items-start gap-3">
          <img src="/logo.png" alt={t('title')} className="h-32 w-32 rounded" />
          <div>
            <h1 className="text-2xl font-bold text-fig-800">{t('title')}</h1>
            <p className="text-sm text-fig-600">{t('subtitle')}</p>
          </div>
        </div>
        <LanguageSwitcher locale={params.locale} />
      </div>

      {isSignup && (
        <div className="rounded-md border border-fig-200 bg-white p-3 text-sm text-fig-700">
          {t('noAdmin')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <label>{t('identifier')}</label>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <label>{t('password')}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {isSignup ? t('signup') : t('login')}
        </button>
        {loading && <div className="text-xs text-fig-500">{common('loading')}</div>}
      </form>
    </div>
  );
}
