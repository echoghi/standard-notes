import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const signedinPages = ['/'];
const authPages = ['/signin', '/signup'];

export default function middleware(req: NextRequest) {
    const token = req.cookies.get('APP_ACCESS_TOKEN')?.value;

    if (signedinPages.find((p) => p === req.nextUrl.pathname)) {
        if (!token) {
            return NextResponse.redirect(new URL('/signin', req.url));
        }
    }

    if (authPages.find((p) => p === req.nextUrl.pathname)) {
        if (token) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }
}
