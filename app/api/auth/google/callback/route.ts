import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_KEY } from '@/lib/token';

/**
 * Google OAuth callback handler.
 *
 * The backend redirects here with the JWT token as a query parameter:
 *   /api/auth/google/callback?token=eyJ...
 *
 * This route runs entirely on the server — it sets the auth cookie and
 * immediately issues a 302 redirect to /dashboard, with zero client-side JS.
 *
 * To use this route, configure the backend's OAuth redirect URI to point to:
 *   https://<your-frontend-domain>/api/auth/google/callback
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
	const { searchParams } = request.nextUrl;

	const token = searchParams.get('token');

	if (!token) {
		// No token → redirect to login with an error hint
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('error', 'oauth_missing_token');
		return NextResponse.redirect(loginUrl);
	}

	// Set cookie directly in the HTTP response headers — no race condition possible
	const maxAge = 7 * 24 * 60 * 60; // 7 days
	const isProduction = process.env.NODE_ENV === 'production';

	// Also write it through the Next.js cookie store so server components can read it immediately
	const cookieStore = await cookies();
	cookieStore.set(TOKEN_KEY, token, {
		httpOnly: false,
		secure: isProduction,
		sameSite: 'lax',
		path: '/',
		maxAge,
	});

	// Redirect directly to dashboard — cookie is already committed
	const dashboardUrl = new URL('/dashboard', request.url);
	const response = NextResponse.redirect(dashboardUrl);

	// Also set via response headers for belt-and-suspenders
	response.cookies.set(TOKEN_KEY, token, {
		httpOnly: false,
		secure: isProduction,
		sameSite: 'lax',
		path: '/',
		maxAge,
	});

	return response;
}
