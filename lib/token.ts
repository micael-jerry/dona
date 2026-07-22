const TOKEN_KEY = 'dona_auth_token';

/**
 * Get stored authentication token from cookies (no localStorage used).
 */
export function getAuthToken(): string | null {
	if (typeof window === 'undefined') return null;

	const nameEQ = TOKEN_KEY + '=';
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}

	return null;
}

/**
 * Save authentication token into secure browser cookie.
 */
export function setAuthToken(token: string, days = 7): void {
	if (typeof window === 'undefined') return;

	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	const expires = `; expires=${date.toUTCString()}`;
	const isHttps = window.location.protocol === 'https:';
	document.cookie = `${TOKEN_KEY}=${token}${expires}; path=/; SameSite=Lax${isHttps ? '; Secure' : ''}`;
}

/**
 * Remove stored authentication token from cookie.
 */
export function removeAuthToken(): void {
	if (typeof window === 'undefined') return;

	document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export { TOKEN_KEY };
