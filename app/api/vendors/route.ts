import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import Vendor from '@/models/Vendor';
import {vendorSchema} from '@/lib/validators';

export async function GET() {
  await connectToDatabase();
  const vendors = await Vendor.find().sort({createdAt: -1}).lean();
  return NextResponse.json({vendors});
}

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json();
  const parsed = vendorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400});
  }
  const vendor = await Vendor.create(parsed.data);
  return NextResponse.json({vendor});
}
