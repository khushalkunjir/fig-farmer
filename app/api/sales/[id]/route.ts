import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import SaleEntry from '@/models/SaleEntry';

export async function GET(_request: Request, {params}: {params: {id: string}}) {
  await connectToDatabase();
  const entry = await SaleEntry.findById(params.id).lean();
  if (!entry) {
    return NextResponse.json({error: 'Not found'}, {status: 404});
  }
  return NextResponse.json({entry});
}

export async function PUT(request: Request, {params}: {params: {id: string}}) {
  await connectToDatabase();
  const body = await request.json();
  const entry = await SaleEntry.findByIdAndUpdate(params.id, body, {new: true}).lean();
  if (!entry) {
    return NextResponse.json({error: 'Not found'}, {status: 404});
  }
  return NextResponse.json({entry});
}

export async function DELETE(_request: Request, {params}: {params: {id: string}}) {
  await connectToDatabase();
  await SaleEntry.findByIdAndDelete(params.id);
  return NextResponse.json({ok: true});
}
