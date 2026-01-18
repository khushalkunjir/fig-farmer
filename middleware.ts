import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n';
import {verifyAuthToken} from './lib/auth';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

const publicPaths = ['/login'];

function isPublicPath(pathname: string) {
  return publicPaths.some((path) => pathname.endsWith(path));
}

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    if (pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }
    const token = request.cookies.get('auth')?.value;
    if (!token) {
      return new NextResponse('Unauthorized', {status: 401});
    }
    const isValid = await verifyAuthToken(token);
    if (!isValid) {
      return new NextResponse('Unauthorized', {status: 401});
    }
    return NextResponse.next();
  }

  const locale = pathname.split('/')[1];
  const isLocalePath = locales.includes(locale as any);

  if (!isLocalePath) {
    return intlMiddleware(request);
  }

  if (isPublicPath(pathname)) {
    const token = request.cookies.get('auth')?.value;
    if (token) {
      const isValid = await verifyAuthToken(token);
      if (isValid) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}`;
        return NextResponse.redirect(url);
      }
    }
    return intlMiddleware(request);
  }

  const token = request.cookies.get('auth')?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  const isValid = await verifyAuthToken(token);
  if (!isValid) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)']
};
