'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/Button';
import {FormRow} from '@/components/FormRow';
import {Table} from '@/components/Table';
import Pagination from '@/components/Pagination';

interface BoxType {
  _id: string;
  name: string;
  defaultQtyPerBox?: number;
}

export default function BoxTypesPage() {
  const t = useTranslations('boxTypes');
  const common = useTranslations('common');
  const [boxTypes, setBoxTypes] = useState<BoxType[]>([]);
  const [form, setForm] = useState({name: '', defaultQtyPerBox: ''});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  async function load() {
    const res = await fetch('/api/box-types');
    const data = await res.json();
    setBoxTypes(data.boxTypes);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [boxTypes]);

  function reset() {
    setForm({name: '', defaultQtyPerBox: ''});
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name,
      defaultQtyPerBox: form.defaultQtyPerBox ? Number(form.defaultQtyPerBox) : undefined
    };

    const res = await fetch(editingId ? `/api/box-types/${editingId}` : '/api/box-types', {
      method: editingId ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      reset();
      load();
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/box-types/${id}`, {method: 'DELETE'});
    load();
  }

  const totalPages = Math.max(1, Math.ceil(boxTypes.length / pageSize));
  const pagedBoxTypes = boxTypes.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-fig-800">{t('title')}</h1>
      <form onSubmit={handleSubmit} className="card grid gap-4 p-4 md:grid-cols-2">
        <FormRow label={t('name')}>
          <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
        </FormRow>
        <FormRow label={t('defaultQtyPerBox')}>
          <input
            type="number"
            min="0"
            value={form.defaultQtyPerBox}
            onChange={(e) => setForm({...form, defaultQtyPerBox: e.target.value})}
          />
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
        headers={[t('name'), t('defaultQtyPerBox'), common('actions')]}
        emptyMessage={common('noData')}
        rows={pagedBoxTypes.map((box) => [
          box.name,
          box.defaultQtyPerBox ?? '-',
          <div className="flex gap-2" key={`${box._id}-actions`}>
            <Button
              variant="secondary"
              onClick={() => {
                setForm({
                  name: box.name,
                  defaultQtyPerBox: box.defaultQtyPerBox?.toString() || ''
                });
                setEditingId(box._id);
              }}
            >
              {common('edit')}
            </Button>
            <Button variant="danger" onClick={() => handleDelete(box._id)}>
              {common('delete')}
            </Button>
          </div>
        ])}
      />
      <Pagination
        page={page}
        pageSize={pageSize}
        total={boxTypes.length}
        onChange={(next) => setPage(Math.min(Math.max(next, 1), totalPages))}
        prevLabel={common('prev')}
        nextLabel={common('next')}
        pageLabel={common('page')}
        ofLabel={common('of')}
      />
    </div>
  );
}
