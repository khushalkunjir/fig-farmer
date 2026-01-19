'use client';

import {useEffect, useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/Button';
import {FormRow} from '@/components/FormRow';
import {Table} from '@/components/Table';
import Pagination from '@/components/Pagination';
import {formatCurrency, formatDate, sumLineItems} from '@/lib/utils';

interface Vendor {
  _id: string;
  name: string;
}

interface BoxType {
  _id: string;
  name: string;
  defaultQtyPerBox?: number;
}

export default function SalesPage() {
  const t = useTranslations('sales');
  const common = useTranslations('common');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [boxTypes, setBoxTypes] = useState<BoxType[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [date, setDate] = useState(formatDate(new Date()));
  const [vendorId, setVendorId] = useState('');
  const [vendorSearch, setVendorSearch] = useState('');
  const [expectedAmount, setExpectedAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([{boxTypeId: '', qtyPerBox: '', boxCount: ''}]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [status, setStatus] = useState('');
  const [filterVendor, setFilterVendor] = useState('');

  async function load() {
    const [vendorRes, boxRes, entryRes] = await Promise.all([
      fetch('/api/vendors'),
      fetch('/api/box-types'),
      fetch(`/api/sales?start=${start}&end=${end}&vendorId=${filterVendor}&status=${status}`)
    ]);
    const vendorData = await vendorRes.json();
    const boxData = await boxRes.json();
    const entryData = await entryRes.json();
    setVendors(vendorData.vendors);
    setBoxTypes(boxData.boxTypes);
    setEntries(entryData.entries);
  }

  useEffect(() => {
    load();
  }, [start, end, status, filterVendor]);

  useEffect(() => {
    setPage(1);
  }, [entries]);

  function updateItem(index: number, patch: Partial<typeof items[number]>) {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? {...item, ...patch} : item))
    );
  }

  function addItem() {
    setItems([...items, {boxTypeId: '', qtyPerBox: '', boxCount: ''}]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, idx) => idx !== index));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const payload = {
      date,
      vendorId,
      expectedAmount: expectedAmount ? Number(expectedAmount) : undefined,
      notes,
      items: items.map((item) => ({
        boxTypeId: item.boxTypeId,
        qtyPerBox: Number(item.qtyPerBox),
        boxCount: Number(item.boxCount)
      }))
    };

    const res = await fetch(editingId ? `/api/sales/${editingId}` : '/api/sales', {
      method: editingId ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setVendorId('');
      setExpectedAmount('');
      setNotes('');
      setItems([{boxTypeId: '', qtyPerBox: '', boxCount: ''}]);
      setEditingId(null);
      load();
    }
  }

  function startEdit(entry: any) {
    setEditingId(entry._id);
    setDate(formatDate(entry.date));
    setVendorId(entry.vendorId);
    setExpectedAmount(entry.expectedAmount?.toString() || '');
    setNotes(entry.notes || '');
    setVendorSearch('');
      setItems(
        entry.items.map((item: any) => ({
          boxTypeId: item.boxTypeId,
          qtyPerBox: item.qtyPerBox.toString(),
          boxCount: item.boxCount.toString()
        }))
      );
  }

  async function handleDelete(id: string) {
    await fetch(`/api/sales/${id}`, {method: 'DELETE'});
    if (editingId === id) {
      setEditingId(null);
      setVendorId('');
      setExpectedAmount('');
      setNotes('');
      setItems([{boxTypeId: '', qtyPerBox: '', boxCount: ''}]);
    }
    load();
  }

  const totals = useMemo(
    () =>
      sumLineItems(
        items.map((item) => ({
          qtyPerBox: Number(item.qtyPerBox) || 0,
          boxCount: Number(item.boxCount) || 0
        }))
      ),
    [items]
  );
  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
  const pagedEntries = entries.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-fig-800">{t('title')}</h1>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormRow label={common('date')}>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </FormRow>
          <FormRow label={t('vendor')}>
            <div className="flex flex-col gap-2">
              <input
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                placeholder={common('search')}
              />
              <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} required>
                <option value="">{t('vendor')}</option>
                {vendors
                  .filter((vendor) => vendor.name.toLowerCase().includes(vendorSearch.toLowerCase()))
                  .map((vendor) => (
                    <option key={vendor._id} value={vendor._id}>
                      {vendor.name}
                    </option>
                  ))}
              </select>
            </div>
          </FormRow>
          <FormRow label={t('expectedAmount')}>
            <input type="number" min="0" value={expectedAmount} onChange={(e) => setExpectedAmount(e.target.value)} />
          </FormRow>
          <FormRow label={common('notes')}>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </FormRow>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-fig-700">{t('newEntry')}</div>
          <Button variant="secondary" onClick={addItem}>{common('add')}</Button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid gap-3 text-xs font-semibold uppercase text-fig-600 md:grid-cols-4">
            <div>{t('boxType')}</div>
            <div>{t('qtyPerBox')}</div>
            <div>{t('boxCount')}</div>
            <div>{common('actions')}</div>
          </div>
          {items.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-4">
              <select
                value={item.boxTypeId}
                onChange={(e) => {
                  const selected = boxTypes.find((box) => box._id === e.target.value);
                  updateItem(index, {
                    boxTypeId: e.target.value,
                    qtyPerBox: selected?.defaultQtyPerBox?.toString() ?? item.qtyPerBox
                  });
                }}
                required
              >
                <option value="">{t('boxType')}</option>
                {boxTypes.map((box) => (
                  <option key={box._id} value={box._id}>
                    {box.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                placeholder={t('qtyPerBox')}
                value={item.qtyPerBox}
                onChange={(e) => updateItem(index, {qtyPerBox: e.target.value})}
                required
              />
              <input
                type="number"
                min="1"
                placeholder={t('boxCount')}
                value={item.boxCount}
                onChange={(e) => updateItem(index, {boxCount: e.target.value})}
                required
              />
              <Button variant="danger" onClick={() => removeItem(index)}>
                {common('delete')}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-sm text-fig-700">
          {common('totalBoxes')}: {totals.totalBoxes} | {common('totalQuantity')}: {totals.totalQuantity}
        </div>

        <div className="flex gap-2">
          <Button type="submit">{editingId ? common('save') : common('add')}</Button>
          {editingId && (
            <Button
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setVendorId('');
                setExpectedAmount('');
                setNotes('');
                setItems([{boxTypeId: '', qtyPerBox: '', boxCount: ''}]);
              }}
            >
              {common('cancel')}
            </Button>
          )}
        </div>
      </form>

      <div className="card flex flex-col gap-4 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <FormRow label={t('filter')}>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </FormRow>
          <FormRow label={common('date')}>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </FormRow>
          <FormRow label={t('vendor')}>
            <select value={filterVendor} onChange={(e) => setFilterVendor(e.target.value)}>
              <option value="">{common('search')}</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </FormRow>
          <FormRow label={common('status')}>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">{common('search')}</option>
              <option value="PENDING">{t('statusPending')}</option>
              <option value="CONFIRMED">{t('statusConfirmed')}</option>
            </select>
          </FormRow>
        </div>

        <Table
          headers={[
            common('date'),
            t('vendor'),
            common('status'),
            common('totalBoxes'),
            common('totalQuantity'),
            t('finalAmount'),
            common('actions')
          ]}
          emptyMessage={common('noData')}
          rows={pagedEntries.map((entry) => {
            const totals = sumLineItems(entry.items);
            const vendorName = vendors.find((vendor) => vendor._id === entry.vendorId)?.name || '-';
            return [
              formatDate(entry.date),
              vendorName,
              entry.status,
              totals.totalBoxes,
              totals.totalQuantity,
              entry.finalAmount ? formatCurrency(entry.finalAmount) : '-',
              <div className="flex gap-2" key={`${entry._id}-actions`}>
                <Button variant="secondary" onClick={() => startEdit(entry)}>
                  {common('edit')}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(entry._id)}>
                  {common('delete')}
                </Button>
              </div>
            ];
          })}
        />
        <Pagination
          page={page}
          pageSize={pageSize}
          total={entries.length}
          onChange={(next) => setPage(Math.min(Math.max(next, 1), totalPages))}
          prevLabel={common('prev')}
          nextLabel={common('next')}
          pageLabel={common('page')}
          ofLabel={common('of')}
        />
      </div>
    </div>
  );
}
