import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import AdminUser from '@/models/AdminUser';
import {signAuthToken, getAuthCookieName, getAuthCookieOptions} from '@/lib/auth';
import {verifyPassword} from '@/lib/password';
import {loginSchema} from '@/lib/validators';

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400});
  }

  const {identifier, password} = parsed.data;
  const admin = await AdminUser.findOne({
    $or: [{username: identifier}, {email: identifier}]
  });

  if (!admin) {
    return NextResponse.json({error: 'Invalid credentials'}, {status: 401});
  }

  const isValid = await verifyPassword(password, admin.passwordHash);
  if (!isValid) {
    return NextResponse.json({error: 'Invalid credentials'}, {status: 401});
  }

  const token = await signAuthToken({userId: admin._id.toString()});
  const response = NextResponse.json({ok: true});
  response.cookies.set(getAuthCookieName(), token, getAuthCookieOptions());
  return response;
}
