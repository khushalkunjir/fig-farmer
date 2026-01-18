import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import AdminUser from '@/models/AdminUser';

export async function GET() {
  await connectToDatabase();
  const count = await AdminUser.countDocuments();
  return NextResponse.json({hasAdmin: count > 0});
}
