import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const signedinPages = new Set(['/']);
const authPages = new Set(['/signin', '/signup']);

// using 'jose' to verify the JWT token because jsonwebtoken is not supported in Vercel edge
async function verify(token?: string, secret?: string): Promise<boolean | string> {
  if (!token || !secret) return false;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return !!payload.id && !!payload.email;
  } catch (e: any) {
    if (e?.code === 'ERR_JWT_EXPIRED') {
      return 'expired';
    }

    return false;
  }
}

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get('_sn_session')?.value;
  const proof = req.cookies.get('proof')?.value;

  const verified = await verify(token, proof);

  if (verified === 'expired') {
    const expiredDate = new Date(0);
    const response = NextResponse.next();
    const secure = process.env.NODE_ENV === 'production';
    // Set the 'expires' property to a past date
    response.cookies.set('_sn_session', '', {
      expires: expiredDate,
      path: '/',
      sameSite: 'strict',
      secure,
    });
    response.cookies.set('proof', '', {
      expires: expiredDate,
      path: '/',
      sameSite: 'strict',
      secure,
    });

    return response;
  }

  if (signedinPages.has(req.nextUrl.pathname)) {
    if (!token || verified !== true) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  } else if (authPages.has(req.nextUrl.pathname)) {
    if (token && verified !== true) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
}
