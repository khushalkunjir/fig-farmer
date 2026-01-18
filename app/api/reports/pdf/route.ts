import {NextResponse} from 'next/server';
import PDFDocument from 'pdfkit';
import {getDailyReport, getMonthlySummary, getVendorTotals} from '@/lib/report';
import {connectToDatabase} from '@/lib/db';
import Vendor from '@/models/Vendor';
import {formatDate} from '@/lib/utils';
import {getMessages, normalizeLocale} from '@/lib/messages';

export const runtime = 'nodejs';

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

  const doc = new PDFDocument({margin: 30});
  const chunks: any[] = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  doc.fontSize(16).text(messages.reports.title, {align: 'left'});
  doc.moveDown();

  if (type === 'monthly') {
    const monthly = await getMonthlySummary(year);
    doc.fontSize(12).text(messages.reports.monthly);
    doc.moveDown(0.5);
    monthly.forEach((item: any) => {
      doc.text(`${item._id}: ${item.totalAmount}`);
    });
  } else if (type === 'vendor') {
    const totals = await getVendorTotals(start, end);
    await connectToDatabase();
    const vendors = await Vendor.find().lean();
    const vendorMap = new Map(vendors.map((vendor: any) => [vendor._id.toString(), vendor.name]));
    doc.fontSize(12).text(messages.reports.vendorTotals);
    doc.moveDown(0.5);
    totals.forEach((item: any) => {
      doc.text(`${vendorMap.get(item._id.toString()) || 'Unknown'}: ${item.totalAmount}`);
    });
  } else {
    const daily = await getDailyReport(start, end);
    doc.fontSize(12).text(messages.reports.daily);
    doc.moveDown(0.5);
    daily.harvest.forEach((item: any) => {
      doc.text(`${formatDate(item._id)} | ${messages.common.totalBoxes}: ${item.totalBoxes} | ${messages.common.totalQuantity}: ${item.totalQuantity}`);
    });
  }

  const buffer = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.end();
  });

  return new NextResponse(buffer as unknown as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report-${type}.pdf"`
    }
  });
}
