import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import AdminUser from '@/models/AdminUser';
import {hashPassword, signAuthToken, getAuthCookieName, getAuthCookieOptions} from '@/lib/auth';
import {signupSchema} from '@/lib/validators';

export async function POST(request: Request) {
  await connectToDatabase();
  const existing = await AdminUser.countDocuments();
  if (existing > 0) {
    return NextResponse.json({error: 'Admin already exists'}, {status: 400});
  }

  const body = await request.json();
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400});
  }

  const {username, email, password} = parsed.data;
  const passwordHash = await hashPassword(password);

  const admin = await AdminUser.create({
    username: username || undefined,
    email: email || undefined,
    passwordHash
  });

  const token = await signAuthToken({userId: admin._id.toString()});
  const response = NextResponse.json({ok: true});
  response.cookies.set(getAuthCookieName(), token, getAuthCookieOptions());
  return response;
}
