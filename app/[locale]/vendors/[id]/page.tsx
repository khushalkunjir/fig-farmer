'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {formatCurrency, formatDate, sumLineItems} from '@/lib/utils';
import {Table} from '@/components/Table';

interface Vendor {
  _id: string;
  name: string;
  phone?: string;
  location?: string;
  notes?: string;
}

export default function VendorDetailPage({params}: {params: {id: string}}) {
  const t = useTranslations('vendors');
  const common = useTranslations('common');
  const salesT = useTranslations('sales');
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const [vendorRes, salesRes] = await Promise.all([
        fetch(`/api/vendors/${params.id}`),
        fetch(`/api/sales?vendorId=${params.id}`)
      ]);
      const vendorData = await vendorRes.json();
      const salesData = await salesRes.json();
      setVendor(vendorData.vendor);
      setSales(salesData.entries);
    }
    load();
  }, [params.id]);

  if (!vendor) {
    return <div>{common('loading')}</div>;
  }

  const pending = sales.filter((entry) => entry.status === 'PENDING');
  const confirmedTotal = sales
    .filter((entry) => entry.status === 'CONFIRMED')
    .reduce((sum, entry) => sum + (entry.finalAmount || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="card p-4">
        <h1 className="text-2xl font-bold text-fig-800">{vendor.name}</h1>
        <div className="text-sm text-fig-600">{vendor.phone || '-'}</div>
        <div className="text-sm text-fig-600">{vendor.location || '-'}</div>
        {vendor.notes && <div className="mt-2 text-sm text-fig-700">{vendor.notes}</div>}
      </div>

      <div className="card p-4">
        <div className="mb-2 text-sm font-semibold text-fig-700">{t('totals')}</div>
        <div className="text-sm">{salesT('finalAmount')}: {formatCurrency(confirmedTotal)}</div>
        <div className="text-sm">{t('pending')}: {pending.length}</div>
      </div>

      <div className="card p-4">
        <div className="mb-3 text-sm font-semibold text-fig-700">{t('salesHistory')}</div>
        <Table
          headers={[common('date'), common('status'), common('totalBoxes'), common('totalQuantity'), salesT('finalAmount')]}
          emptyMessage={common('noData')}
          rows={sales.map((entry) => {
            const totals = sumLineItems(entry.items);
            return [
              formatDate(entry.date),
              entry.status,
              totals.totalBoxes,
              totals.totalQuantity,
              entry.finalAmount ? formatCurrency(entry.finalAmount) : '-'
            ];
          })}
        />
      </div>
    </div>
  );
}
