import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import HarvestEntry from '@/models/HarvestEntry';
import {harvestSchema} from '@/lib/validators';

export async function GET(request: Request) {
  await connectToDatabase();
  const url = new URL(request.url);
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');

  const query: any = {};
  if (start && end) {
    query.date = { $gte: new Date(start), $lte: new Date(end) };
  }

  const entries = await HarvestEntry.find(query).sort({date: -1}).lean();
  return NextResponse.json({entries});
}

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json();
  const parsed = harvestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400});
  }

  const entry = await HarvestEntry.create({
    ...parsed.data,
    date: new Date(parsed.data.date)
  });

  return NextResponse.json({entry});
}
