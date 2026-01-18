import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import BoxType from '@/models/BoxType';
import {boxTypeSchema} from '@/lib/validators';

export async function PUT(request: Request, {params}: {params: {id: string}}) {
  await connectToDatabase();
  const body = await request.json();
  const parsed = boxTypeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400});
  }
  const boxType = await BoxType.findByIdAndUpdate(params.id, parsed.data, {new: true}).lean();
  if (!boxType) {
    return NextResponse.json({error: 'Not found'}, {status: 404});
  }
  return NextResponse.json({boxType});
}

export async function DELETE(_request: Request, {params}: {params: {id: string}}) {
  await connectToDatabase();
  await BoxType.findByIdAndDelete(params.id);
  return NextResponse.json({ok: true});
}
