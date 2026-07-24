'use server';

import { cookies } from 'next/headers';
import { TOKEN_KEY } from '@/lib/token';

/**
 * Server Action to set the authentication cookie in Next.js 16 header cookies.
 */
export async function setAuthCookieAction(token: string) {
	const cookieStore = await cookies();
	cookieStore.set(TOKEN_KEY, token, {
		httpOnly: false, // set to false so client Axios interceptor can also read it synchronously
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 7 * 24 * 60 * 60, // 7 days
	});
}

/**
 * Server Action to delete the authentication cookie in Next.js 16 header cookies.
 */
export async function removeAuthCookieAction() {
	const cookieStore = await cookies();
	cookieStore.delete(TOKEN_KEY);
}

/**
 * Server Action to read the authentication cookie from Next.js 16 server context.
 */
export async function getAuthCookieAction() {
	const cookieStore = await cookies();
	return cookieStore.get(TOKEN_KEY)?.value || null;
}
