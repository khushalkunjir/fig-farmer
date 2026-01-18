import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import SaleEntry from '@/models/SaleEntry';
import {confirmSaleSchema} from '@/lib/validators';

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json();
  const parsed = confirmSaleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400});
  }

  const {saleId, finalAmount, confirmationDate} = parsed.data;
  const entry = await SaleEntry.findByIdAndUpdate(
    saleId,
    {
      finalAmount,
      confirmationDate: new Date(confirmationDate),
      status: 'CONFIRMED'
    },
    {new: true}
  ).lean();

  return NextResponse.json({entry});
}
