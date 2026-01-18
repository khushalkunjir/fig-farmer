import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import SaleEntry from '@/models/SaleEntry';
import {saleSchema} from '@/lib/validators';

export async function GET(request: Request) {
  await connectToDatabase();
  const url = new URL(request.url);
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  const vendorId = url.searchParams.get('vendorId');
  const status = url.searchParams.get('status');

  const query: any = {};
  if (start && end) {
    query.date = {$gte: new Date(start), $lte: new Date(end)};
  }
  if (vendorId) query.vendorId = vendorId;
  if (status) query.status = status;

  const entries = await SaleEntry.find(query).sort({date: -1}).lean();
  return NextResponse.json({entries});
}

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json();
  const parsed = saleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400});
  }

  const entry = await SaleEntry.create({
    ...parsed.data,
    date: new Date(parsed.data.date)
  });

  return NextResponse.json({entry});
}
