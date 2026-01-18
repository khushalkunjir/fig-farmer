'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Table} from '@/components/Table';
import {Button} from '@/components/Button';
import {FormRow} from '@/components/FormRow';
import {formatCurrency, formatDate} from '@/lib/utils';
import Pagination from '@/components/Pagination';

export default function ReportsPage({params}: {params: {locale: string}}) {
  const t = useTranslations('reports');
  const common = useTranslations('common');
  const [daily, setDaily] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [dailyPage, setDailyPage] = useState(1);
  const [monthlyPage, setMonthlyPage] = useState(1);
  const [vendorPage, setVendorPage] = useState(1);
  const pageSize = 20;

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

  useEffect(() => {
    setDailyPage(1);
  }, [daily]);

  useEffect(() => {
    setMonthlyPage(1);
  }, [monthly]);

  useEffect(() => {
    setVendorPage(1);
  }, [vendors]);

  const dailyTotalPages = Math.max(1, Math.ceil(daily.length / pageSize));
  const monthlyTotalPages = Math.max(1, Math.ceil(monthly.length / pageSize));
  const vendorTotalPages = Math.max(1, Math.ceil(vendors.length / pageSize));
  const pagedDaily = daily.slice((dailyPage - 1) * pageSize, dailyPage * pageSize);
  const pagedMonthly = monthly.slice((monthlyPage - 1) * pageSize, monthlyPage * pageSize);
  const pagedVendors = vendors.slice((vendorPage - 1) * pageSize, vendorPage * pageSize);

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
      </div>

      <div className="card flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-fig-700">{t('daily')}</div>
        </div>
        <Table
          headers={[common('date'), common('totalBoxes'), common('totalQuantity')]}
          emptyMessage={common('noData')}
          rows={pagedDaily.map((item: any) => [formatDate(item._id), item.totalBoxes, item.totalQuantity])}
        />
        <Pagination
          page={dailyPage}
          pageSize={pageSize}
          total={daily.length}
          onChange={(next) => setDailyPage(Math.min(Math.max(next, 1), dailyTotalPages))}
          prevLabel={common('prev')}
          nextLabel={common('next')}
          pageLabel={common('page')}
          ofLabel={common('of')}
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
          </div>
        </div>
        <Table
          headers={[t('month'), common('amount')]}
          emptyMessage={common('noData')}
          rows={pagedMonthly.map((item: any) => [item._id, formatCurrency(item.totalAmount)])}
        />
        <Pagination
          page={monthlyPage}
          pageSize={pageSize}
          total={monthly.length}
          onChange={(next) => setMonthlyPage(Math.min(Math.max(next, 1), monthlyTotalPages))}
          prevLabel={common('prev')}
          nextLabel={common('next')}
          pageLabel={common('page')}
          ofLabel={common('of')}
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
          </div>
        </div>
        <Table
          headers={[t('vendorTotals'), common('amount')]}
          emptyMessage={common('noData')}
          rows={pagedVendors.map((item: any) => [item.vendorName, formatCurrency(item.totalAmount)])}
        />
        <Pagination
          page={vendorPage}
          pageSize={pageSize}
          total={vendors.length}
          onChange={(next) => setVendorPage(Math.min(Math.max(next, 1), vendorTotalPages))}
          prevLabel={common('prev')}
          nextLabel={common('next')}
          pageLabel={common('page')}
          ofLabel={common('of')}
        />
      </div>
    </div>
  );
}
