'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/Button';
import {FormRow} from '@/components/FormRow';
import {Table} from '@/components/Table';
import Pagination from '@/components/Pagination';

interface Vendor {
  _id: string;
  name: string;
  phone?: string;
  location?: string;
  notes?: string;
}

export default function VendorsPage({params}: {params: {locale: string}}) {
  const t = useTranslations('vendors');
  const common = useTranslations('common');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [form, setForm] = useState({name: '', phone: '', location: '', notes: ''});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  async function load() {
    const res = await fetch('/api/vendors');
    const data = await res.json();
    setVendors(data.vendors);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [vendors]);

  function reset() {
    setForm({name: '', phone: '', location: '', notes: ''});
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) return;

    const res = await fetch(editingId ? `/api/vendors/${editingId}` : '/api/vendors', {
      method: editingId ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(form)
    });

    if (res.ok) {
      reset();
      load();
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/vendors/${id}`, {method: 'DELETE'});
    load();
  }

  const totalPages = Math.max(1, Math.ceil(vendors.length / pageSize));
  const pagedVendors = vendors.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-fig-800">{t('title')}</h1>

      <form onSubmit={handleSubmit} className="card grid gap-4 p-4 md:grid-cols-2">
        <FormRow label={t('name')}>
          <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
        </FormRow>
        <FormRow label={t('phone')}>
          <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
        </FormRow>
        <FormRow label={t('location')}>
          <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} />
        </FormRow>
        <FormRow label={t('notes')}>
          <input value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
        </FormRow>
        <div className="flex gap-2">
          <Button type="submit">{editingId ? common('save') : common('add')}</Button>
          {editingId && (
            <Button variant="secondary" onClick={reset}>
              {common('cancel')}
            </Button>
          )}
        </div>
      </form>

      <Table
        headers={[t('name'), t('phone'), t('location'), common('actions')]}
        emptyMessage={common('noData')}
        rows={pagedVendors.map((vendor) => [
          <Link key={vendor._id} href={`/${params.locale}/vendors/${vendor._id}`} className="text-fig-700 hover:text-fig-900">
            {vendor.name}
          </Link>,
          vendor.phone || '-',
          vendor.location || '-',
          <div className="flex gap-2" key={`${vendor._id}-actions`}>
            <Button
              variant="secondary"
              onClick={() => {
                setForm({
                  name: vendor.name,
                  phone: vendor.phone || '',
                  location: vendor.location || '',
                  notes: vendor.notes || ''
                });
                setEditingId(vendor._id);
              }}
            >
              {common('edit')}
            </Button>
            <Button variant="danger" onClick={() => handleDelete(vendor._id)}>
              {common('delete')}
            </Button>
          </div>
        ])}
      />
      <Pagination
        page={page}
        pageSize={pageSize}
        total={vendors.length}
        onChange={(next) => setPage(Math.min(Math.max(next, 1), totalPages))}
        prevLabel={common('prev')}
        nextLabel={common('next')}
        pageLabel={common('page')}
        ofLabel={common('of')}
      />
    </div>
  );
}
