import { useAuthStore, type AuthResult } from '@/store/use-auth-store';

/**
 * Interface Segregation Principle (ISP): Granular hooks preventing unneeded component re-renders.
 */

/**
 * Returns current authenticated user object.
 */
export function useUser() {
	return useAuthStore((s) => s.user);
}

/**
 * Returns authentication status boolean.
 */
export function useIsAuthenticated() {
	return useAuthStore((s) => s.isAuthenticated);
}

/**
 * Returns auth loading status boolean.
 */
export function useAuthLoading() {
	return useAuthStore((s) => s.isLoading);
}

/**
 * Returns authentication actions (login, logout, refreshUser).
 */
export function useAuthActions() {
	const login = useAuthStore((s) => s.login);
	const logout = useAuthStore((s) => s.logout);
	const refreshUser = useAuthStore((s) => s.initialize);

	return { login, logout, refreshUser };
}

/**
 * Unified custom hook wrapping the global Zustand auth store.
 */
export function useAuth() {
	const user = useAuthStore((s) => s.user);
	const token = useAuthStore((s) => s.token);
	const isLoading = useAuthStore((s) => s.isLoading);
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const login = useAuthStore((s) => s.login);
	const logout = useAuthStore((s) => s.logout);
	const refreshUser = useAuthStore((s) => s.initialize);

	return {
		user,
		token,
		isLoading,
		isAuthenticated,
		login,
		logout,
		refreshUser,
	};
}

export { type AuthResult };
