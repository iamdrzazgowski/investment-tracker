import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

// Routes accessible without a session.
// '/' = start page, '/login' + '/signup' = auth pages.
const PUBLIC_ROUTES = ['/', '/login', '/signup', '/dashboard'];

function isPublicPath(pathname: string): boolean {
    return PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Always allow better-auth API routes.
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // API routes must never redirect to HTML (e.g. /login) — fetch callers
    // would then fail with "Unexpected token '<', "<!DOCTYPE"... is not
    // valid JSON". Return JSON 401 instead.
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
        if (!session && !isPublicPath(pathname)) {
            return NextResponse.json(
                { error: 'Unauthorized', results: [] },
                { status: 401 },
            );
        }
        return NextResponse.next();
    }

    if (!session && !isPublicPath(pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Logged-in users don't need the auth pages again.
    if (session && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
