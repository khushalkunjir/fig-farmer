import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import Vendor from '@/models/Vendor';
import {vendorSchema} from '@/lib/validators';

export async function GET(_request: Request, {params}: {params: {id: string}}) {
  await connectToDatabase();
  const vendor = await Vendor.findById(params.id).lean();
  if (!vendor) {
    return NextResponse.json({error: 'Not found'}, {status: 404});
  }
  return NextResponse.json({vendor});
}

export async function PUT(request: Request, {params}: {params: {id: string}}) {
  await connectToDatabase();
  const body = await request.json();
  const parsed = vendorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400});
  }
  const vendor = await Vendor.findByIdAndUpdate(params.id, parsed.data, {new: true}).lean();
  if (!vendor) {
    return NextResponse.json({error: 'Not found'}, {status: 404});
  }
  return NextResponse.json({vendor});
}

export async function DELETE(_request: Request, {params}: {params: {id: string}}) {
  await connectToDatabase();
  await Vendor.findByIdAndDelete(params.id);
  return NextResponse.json({ok: true});
}
