import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { TOKEN_KEY } from './lib/token';

const intlMiddleware = createMiddleware(routing);

// Routes requiring authentication
const protectedRoutes = ['/dashboard'];

// Routes only accessible to guests (unauthenticated users)
const guestOnlyRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get(TOKEN_KEY)?.value;

	// Extract path without locale prefix (e.g. /fr/dashboard -> /dashboard)
	const pathnameWithoutLocale = pathname.replace(/^\/(?:en|fr|es)/, '') || '/';

	const isProtectedRoute = protectedRoutes.some((route) => pathnameWithoutLocale.startsWith(route));
	const isGuestOnlyRoute = guestOnlyRoutes.some((route) => pathnameWithoutLocale.startsWith(route));

	// Determine locale from URL or fallback to default
	const localeMatch = pathname.match(/^\/(en|fr|es)/);
	const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

	// 1. If unauthenticated user tries to access a protected route -> Redirect to /login
	if (isProtectedRoute && !token) {
		const loginUrl = new URL(`/${locale}/login`, request.url);
		loginUrl.searchParams.set('from', pathnameWithoutLocale);
		return NextResponse.redirect(loginUrl);
	}

	// 2. If authenticated user tries to access guest-only routes -> Redirect to /dashboard
	if (isGuestOnlyRoute && token) {
		return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
	}

	// 3. Delegate to next-intl middleware for locale routing
	return intlMiddleware(request);
}

export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
