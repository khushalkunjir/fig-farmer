import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import BoxType from '@/models/BoxType';
import {boxTypeSchema} from '@/lib/validators';

export async function GET() {
  await connectToDatabase();
  const boxTypes = await BoxType.find().sort({createdAt: -1}).lean();
  return NextResponse.json({boxTypes});
}

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json();
  const parsed = boxTypeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400});
  }
  const boxType = await BoxType.create(parsed.data);
  return NextResponse.json({boxType});
}
