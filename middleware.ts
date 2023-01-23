import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const signedinPages = ['/'];
const authPages = ['/signin', '/signup'];

// using 'jose' to verify the JWT token because jsonwebtoken is not supported in Vercel edge functions
async function verify(token?: string, secret?: string): Promise<boolean> {
    let verified = false;

    if (!token || !secret) return verified;

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        verified = !!payload.id && !!payload.email;
    } catch (e) {
        console.log(e);
    }

    return verified;
}

export default async function middleware(req: NextRequest) {
    const token = req.cookies.get('_sn_session')?.value;
    const proof = req.cookies.get('proof')?.value;

    const verified = await verify(token, proof);

    if (signedinPages.find((p) => p === req.nextUrl.pathname)) {
        if (!token || !verified) {
            return NextResponse.redirect(new URL('/signin', req.url));
        }
    } else if (authPages.find((p) => p === req.nextUrl.pathname)) {
        if (token && verified) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }
}
