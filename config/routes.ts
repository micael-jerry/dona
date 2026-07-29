// ─── Route Classification ─────────────────────────────────────────────────────
//
// ✅ ADD NEW PROTECTED PAGES HERE
// ✅ ADD NEW PUBLIC-ONLY PAGES HERE (guest-only, redirect to dashboard if logged in)
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Routes only accessible by authenticated users.
 * Unauthenticated visitors are redirected to LOGIN_REDIRECT.
 *
 * Use a prefix to protect an entire section: '/admin' covers '/admin/*'.
 */
export const PROTECTED_ROUTES: string[] = [
	'/dashboard',
	'/account',
	'/map',
	// Add new protected routes here, e.g.:
	// '/leaderboard',
	// '/admin',
];

/**
 * Routes only accessible by guests (non-authenticated users).
 * Authenticated users are redirected to AUTH_REDIRECT.
 */
export const GUEST_ONLY_ROUTES: string[] = [
	'/',
	'/login',
	'/register',
	'/forgot-password',
	'/reset-password',
	// Add new guest-only routes here if needed.
];

/** Where to send unauthenticated users who try to access a protected route. */
export const LOGIN_REDIRECT = '/login';

/** Where to send authenticated users who try to access a guest-only route. */
export const AUTH_REDIRECT = '/dashboard';
