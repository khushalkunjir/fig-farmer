'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/Button';
import {Table} from '@/components/Table';
import {formatCurrency, formatDate, sumLineItems} from '@/lib/utils';

export default function PendingPage() {
  const t = useTranslations('pending');
  const common = useTranslations('common');
  const salesT = useTranslations('sales');
  const [entries, setEntries] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [finalAmount, setFinalAmount] = useState<Record<string, string>>({});
  const [confirmationDate, setConfirmationDate] = useState<Record<string, string>>({});

  async function load() {
    const [salesRes, vendorRes] = await Promise.all([
      fetch('/api/sales?status=PENDING'),
      fetch('/api/vendors')
    ]);
    const salesData = await salesRes.json();
    const vendorData = await vendorRes.json();
    setEntries(salesData.entries);
    setVendors(vendorData.vendors);
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmSale(id: string) {
    const amount = finalAmount[id];
    const date = confirmationDate[id];
    if (!amount || !date) return;

    await fetch('/api/pending/confirm', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        saleId: id,
        finalAmount: Number(amount),
        confirmationDate: date
      })
    });
    load();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-fig-800">{t('title')}</h1>

      <Table
        headers={[
          common('date'),
          salesT('vendor'),
          common('totalBoxes'),
          common('totalQuantity'),
          salesT('expectedAmount'),
          salesT('finalAmount'),
          t('confirmationDate'),
          common('actions')
        ]}
        emptyMessage={common('noData')}
        rows={entries.map((entry) => {
          const totals = sumLineItems(entry.items);
          const vendorName = vendors.find((vendor) => vendor._id === entry.vendorId)?.name || '-';
          return [
            formatDate(entry.date),
            vendorName,
            totals.totalBoxes,
            totals.totalQuantity,
            entry.expectedAmount ? formatCurrency(entry.expectedAmount) : '-',
            <input
              key={`${entry._id}-amount`}
              type="number"
              min="0"
              value={finalAmount[entry._id] || ''}
              onChange={(e) => setFinalAmount({...finalAmount, [entry._id]: e.target.value})}
            />,
            <input
              key={`${entry._id}-date`}
              type="date"
              value={confirmationDate[entry._id] || ''}
              onChange={(e) => setConfirmationDate({...confirmationDate, [entry._id]: e.target.value})}
            />,
            <Button key={`${entry._id}-confirm`} onClick={() => confirmSale(entry._id)}>
              {common('confirm')}
            </Button>
          ];
        })}
      />
    </div>
  );
}
