'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Table} from '@/components/Table';
import {Button} from '@/components/Button';
import {FormRow} from '@/components/FormRow';
import {formatCurrency, formatDate} from '@/lib/utils';

export default function ReportsPage({params}: {params: {locale: string}}) {
  const t = useTranslations('reports');
  const common = useTranslations('common');
  const [daily, setDaily] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  async function load() {
    const res = await fetch(`/api/reports/summary?start=${start}&end=${end}&year=${year}`);
    const data = await res.json();
    setDaily(data.daily.harvest || []);
    setMonthly(data.monthly || []);
    setVendors(data.vendorTotals || []);
  }

  useEffect(() => {
    load();
  }, [start, end, year]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-fig-800">{t('title')}</h1>

      <div className="card flex flex-wrap items-end gap-4 p-4">
        <FormRow label={t('startDate')}>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </FormRow>
        <FormRow label={t('endDate')}>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </FormRow>
        <FormRow label={t('year')}>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </FormRow>
        <a
          className="btn btn-secondary"
          href={`/api/reports/csv?type=daily&start=${start}&end=${end}&locale=${params.locale}`}
        >
          {common('exportCsv')}
        </a>
        <a
          className="btn btn-secondary"
          href={`/api/reports/pdf?type=daily&start=${start}&end=${end}&locale=${params.locale}`}
        >
          {common('exportPdf')}
        </a>
      </div>

      <div className="card flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-fig-700">{t('daily')}</div>
        </div>
        <Table
          headers={[common('date'), common('totalBoxes'), common('totalQuantity')]}
          emptyMessage={common('noData')}
          rows={daily.map((item: any) => [formatDate(item._id), item.totalBoxes, item.totalQuantity])}
        />
      </div>

      <div className="card flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-fig-700">{t('monthly')}</div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => window.open(`/api/reports/csv?type=monthly&year=${year}&locale=${params.locale}`)}
            >
              {common('exportCsv')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.open(`/api/reports/pdf?type=monthly&year=${year}&locale=${params.locale}`)}
            >
              {common('exportPdf')}
            </Button>
          </div>
        </div>
        <Table
          headers={[t('month'), common('amount')]}
          emptyMessage={common('noData')}
          rows={monthly.map((item: any) => [item._id, formatCurrency(item.totalAmount)])}
        />
      </div>

      <div className="card flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-fig-700">{t('vendorTotals')}</div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => window.open(`/api/reports/csv?type=vendor&start=${start}&end=${end}&locale=${params.locale}`)}
            >
              {common('exportCsv')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.open(`/api/reports/pdf?type=vendor&start=${start}&end=${end}&locale=${params.locale}`)}
            >
              {common('exportPdf')}
            </Button>
          </div>
        </div>
        <Table
          headers={[t('vendorTotals'), common('amount')]}
          emptyMessage={common('noData')}
          rows={vendors.map((item: any) => [item.vendorName, formatCurrency(item.totalAmount)])}
        />
      </div>
    </div>
  );
}
