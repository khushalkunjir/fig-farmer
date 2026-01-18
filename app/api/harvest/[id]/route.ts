import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import HarvestEntry from '@/models/HarvestEntry';
import {harvestSchema} from '@/lib/validators';

export async function PUT(request: Request, {params}: {params: {id: string}}) {
  await connectToDatabase();
  const body = await request.json();
  const parsed = harvestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400});
  }

  const entry = await HarvestEntry.findByIdAndUpdate(
    params.id,
    {
      ...parsed.data,
      date: new Date(parsed.data.date)
    },
    {new: true}
  ).lean();

  if (!entry) {
    return NextResponse.json({error: 'Not found'}, {status: 404});
  }

  return NextResponse.json({entry});
}

export async function DELETE(_request: Request, {params}: {params: {id: string}}) {
  await connectToDatabase();
  await HarvestEntry.findByIdAndDelete(params.id);
  return NextResponse.json({ok: true});
}
