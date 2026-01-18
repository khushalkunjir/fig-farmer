'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {Card} from '@/components/Card';
import {formatCurrency} from '@/lib/utils';

export default function DashboardPage({params}: {params: {locale: string}}) {
  const t = useTranslations('dashboard');
  const common = useTranslations('common');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/reports/summary?mode=dashboard');
      const payload = await res.json();
      setData(payload.data);
    }
    load();
  }, []);

  if (!data) {
    return <div>{common('loading')}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-fig-800">{t('title')}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title={t('packedTotals')}>
          <div className="text-sm text-fig-700">{common('totalBoxes')}: {data.harvest.totalBoxes}</div>
          <div className="text-sm text-fig-700">{common('totalQuantity')}: {data.harvest.totalQuantity}</div>
        </Card>
        <Card title={t('soldTotals')}>
          <div className="text-sm text-fig-700">{common('totalBoxes')}: {data.sales.totalBoxes}</div>
          <div className="text-sm text-fig-700">{common('totalQuantity')}: {data.sales.totalQuantity}</div>
        </Card>
        <Card title={t('pendingCount')}>
          <div className="text-2xl font-bold text-fig-800">{data.pendingCount}</div>
        </Card>
        <Card title={t('monthConfirmed')}>
          <div className="text-2xl font-bold text-fig-800">{formatCurrency(data.monthConfirmedAmount)}</div>
        </Card>
      </div>
      <Card title={t('quickActions')}>
        <div className="flex flex-wrap gap-3">
          <Link className="btn btn-primary" href={`/${params.locale}/harvest`}>
            {t('newHarvest')}
          </Link>
          <Link className="btn btn-primary" href={`/${params.locale}/sales`}>
            {t('newSale')}
          </Link>
          <Link className="btn btn-secondary" href={`/${params.locale}/pending`}>
            {t('viewPending')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
