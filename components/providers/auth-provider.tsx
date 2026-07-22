'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { login as apiLogin, whoami as apiWhoami, type UserResponse, type LoginRequest } from '@/lib/api';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/token';
import { setAuthCookieAction, removeAuthCookieAction } from '@/app/actions/auth';

export interface AuthResult {
	success: boolean;
	user?: UserResponse;
	error?: string;
}

export interface AuthContextType {
	user: UserResponse | null;
	token: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (credentials: LoginRequest) => Promise<AuthResult>;
	logout: () => void;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserResponse | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const logout = useCallback(() => {
		removeAuthToken();
		removeAuthCookieAction().catch(() => {});
		setToken(null);
		setUser(null);
	}, []);

	const refreshUser = useCallback(async () => {
		const storedToken = getAuthToken();
		if (!storedToken) {
			setUser(null);
			setToken(null);
			setIsLoading(false);
			return;
		}

		try {
			const res = await apiWhoami();
			if (res.data) {
				setUser(res.data);
				setToken(storedToken);
			} else {
				logout();
			}
		} catch {
			logout();
		} finally {
			setIsLoading(false);
		}
	}, [logout]);

	useEffect(() => {
		let isMounted = true;

		const initAuth = async () => {
			const storedToken = getAuthToken();
			if (!storedToken) {
				if (isMounted) {
					setIsLoading(false);
				}
				return;
			}

			try {
				const res = await apiWhoami();
				if (isMounted) {
					if (res.data) {
						setUser(res.data);
						setToken(storedToken);
					} else {
						logout();
					}
				}
			} catch {
				if (isMounted) {
					logout();
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		initAuth();

		return () => {
			isMounted = false;
		};
	}, [logout]);

	const login = useCallback(async (credentials: LoginRequest): Promise<AuthResult> => {
		try {
			const res = await apiLogin({ body: credentials });

			if (res.error || !res.data?.token) {
				const errorObj = res.error as { message?: string } | undefined;
				const errorMessage = errorObj?.message || 'Email ou mot de passe incorrect.';
				return { success: false, error: errorMessage };
			}

			const { token: newToken, user: userData } = res.data;

			// Save token securely in cookie (client JS + server action for Next.js 16)
			setAuthToken(newToken);
			await setAuthCookieAction(newToken).catch(() => {});

			setToken(newToken);
			setUser(userData);

			return { success: true, user: userData };
		} catch (err: unknown) {
			const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
			const message =
				axiosErr?.response?.data?.message || axiosErr?.message || 'Une erreur est survenue lors de la connexion.';
			return { success: false, error: message };
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				isLoading,
				isAuthenticated: !!user && !!token,
				login,
				logout,
				refreshUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
