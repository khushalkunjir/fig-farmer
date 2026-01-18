import bcrypt from 'bcryptjs';
import {SignJWT, jwtVerify} from 'jose';

const AUTH_COOKIE = 'auth';
const ONE_WEEK = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not defined');
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signAuthToken(payload: {userId: string}) {
  return new SignJWT({sub: payload.userId})
    .setProtectedHeader({alg: 'HS256'})
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyAuthToken(token: string) {
  try {
    const {payload} = await jwtVerify(token, getSecret());
    return !!payload.sub;
  } catch (error) {
    return false;
  }
}

export function getAuthCookieName() {
  return AUTH_COOKIE;
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ONE_WEEK
  };
}
