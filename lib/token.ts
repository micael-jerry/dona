const TOKEN_KEY = 'dona_auth_token';

/**
 * Single Responsibility: Manage client-side authentication token persistence in browser cookies.
 */

export function getAuthToken(): string | null {
	if (typeof document === 'undefined') return null;

	const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : null;
}

export function setAuthToken(token: string, days = 7): void {
	if (typeof document === 'undefined') return;

	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	const expires = `; expires=${date.toUTCString()}`;
	const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

	document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}${expires}; path=/; SameSite=Lax${isHttps ? '; Secure' : ''}`;
}

export function removeAuthToken(): void {
	if (typeof document === 'undefined') return;

	document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export { TOKEN_KEY };
