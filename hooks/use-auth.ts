import { useAuthStore, type AuthResult } from '@/store/use-auth-store';

/**
 * Custom hook wrapping the global Zustand auth store.
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
