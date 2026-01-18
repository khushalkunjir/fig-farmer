import {NextResponse} from 'next/server';
import {getDashboardTotals, getDailyReport, getMonthlySummary, getVendorTotals} from '@/lib/report';
import {connectToDatabase} from '@/lib/db';
import Vendor from '@/models/Vendor';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('mode');

  if (mode === 'dashboard') {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    const data = await getDashboardTotals(start, end);
    return NextResponse.json({data});
  }

  const startParam = url.searchParams.get('start');
  const endParam = url.searchParams.get('end');
  const yearParam = url.searchParams.get('year');

  const start = startParam ? new Date(startParam) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = endParam ? new Date(endParam) : new Date();
  const year = yearParam ? Number(yearParam) : new Date().getFullYear();

  const [daily, monthly, vendorTotals] = await Promise.all([
    getDailyReport(start, end),
    getMonthlySummary(year),
    getVendorTotals(start, end)
  ]);

  await connectToDatabase();
  const vendors = await Vendor.find().lean();
  const vendorMap = new Map(vendors.map((vendor: any) => [vendor._id.toString(), vendor.name]));

  const vendorTotalsNamed = vendorTotals.map((item: any) => ({
    vendorId: item._id.toString(),
    vendorName: vendorMap.get(item._id.toString()) || 'Unknown',
    totalAmount: item.totalAmount
  }));

  return NextResponse.json({
    daily,
    monthly,
    vendorTotals: vendorTotalsNamed
  });
}
