import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { TOKEN_KEY } from './lib/token';
import { PROTECTED_ROUTES, GUEST_ONLY_ROUTES, LOGIN_REDIRECT, AUTH_REDIRECT } from './config/routes';

const intlMiddleware = createIntlMiddleware(routing);

/** Extract path without locale prefix: /fr/dashboard → /dashboard, /dashboard → /dashboard */
function stripLocalePrefix(pathname: string): string {
	const locales = routing.locales.join('|');
	return pathname.replace(new RegExp(`^/(${locales})(/|$)`), '/').replace(/\/$/, '') || '/';
}

/** Get the current locale from URL, or fall back to the default locale */
function getLocale(pathname: string): string {
	const match = pathname.match(new RegExp(`^/(${routing.locales.join('|')})`));
	return match ? match[1] : routing.defaultLocale;
}

/** True if `path` matches any of the route prefixes (exact or sub-path). */
function matchesAny(path: string, routes: string[]): boolean {
	return routes.some((route) => (route === '/' ? path === '/' : path === route || path.startsWith(`${route}/`)));
}

export default function proxy(request: NextRequest): NextResponse {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get(TOKEN_KEY)?.value;
	const isAuthenticated = Boolean(token);

	const localePath = stripLocalePrefix(pathname);
	const locale = getLocale(pathname);

	// 1. Authenticated user → redirect away from guest-only pages (home, login, register…)
	if (isAuthenticated && matchesAny(localePath, GUEST_ONLY_ROUTES)) {
		return NextResponse.redirect(new URL(`/${locale}${AUTH_REDIRECT}`, request.url));
	}

	// 2. Unauthenticated user → redirect away from protected pages (dashboard, account…)
	if (!isAuthenticated && matchesAny(localePath, PROTECTED_ROUTES)) {
		const loginUrl = new URL(`/${locale}${LOGIN_REDIRECT}`, request.url);
		// Preserve the original destination so we can redirect back after login
		loginUrl.searchParams.set('from', localePath);
		return NextResponse.redirect(loginUrl);
	}

	// 3. Delegate to next-intl middleware for locale routing
	return intlMiddleware(request);
}

export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
