import {NextResponse} from 'next/server';
import {stringify} from 'csv-stringify/sync';
import {getDailyReport, getMonthlySummary, getVendorTotals} from '@/lib/report';
import {connectToDatabase} from '@/lib/db';
import Vendor from '@/models/Vendor';
import {formatDate} from '@/lib/utils';
import {getMessages, normalizeLocale} from '@/lib/messages';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'daily';
  const locale = normalizeLocale(url.searchParams.get('locale') || undefined);
  const messages = getMessages(locale);

  const startParam = url.searchParams.get('start');
  const endParam = url.searchParams.get('end');
  const yearParam = url.searchParams.get('year');

  const start = startParam ? new Date(startParam) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = endParam ? new Date(endParam) : new Date();
  const year = yearParam ? Number(yearParam) : new Date().getFullYear();

  let csv = '';

  if (type === 'monthly') {
    const monthly = await getMonthlySummary(year);
    const rows = monthly.map((item: any) => [item._id, item.totalAmount]);
    csv = stringify([
      [messages.export.month, messages.export.totalAmount],
      ...rows
    ]);
  } else if (type === 'vendor') {
    const totals = await getVendorTotals(start, end);
    await connectToDatabase();
    const vendors = await Vendor.find().lean();
    const vendorMap = new Map(vendors.map((vendor: any) => [vendor._id.toString(), vendor.name]));
    const rows = totals.map((item: any) => [vendorMap.get(item._id.toString()) || 'Unknown', item.totalAmount]);
    csv = stringify([
      [messages.export.vendor, messages.export.totalAmount],
      ...rows
    ]);
  } else {
    const daily = await getDailyReport(start, end);
    const rows = daily.harvest.map((item: any) => [formatDate(item._id), item.totalBoxes, item.totalQuantity]);
    csv = stringify([
      [messages.export.date, messages.common.totalBoxes, messages.common.totalQuantity],
      ...rows
    ]);
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="report-${type}.csv"`
    }
  });
}
