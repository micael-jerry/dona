import { create } from 'zustand';
import { login as apiLogin, whoami as apiWhoami, type UserResponse, type LoginRequest } from '@/lib/api';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/token';
import { setAuthCookieAction, removeAuthCookieAction } from '@/app/actions/auth';

export interface AuthResult {
	success: boolean;
	user?: UserResponse;
	error?: string;
}

export interface AuthState {
	user: UserResponse | null;
	token: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (credentials: LoginRequest) => Promise<AuthResult>;
	logout: () => void;
	initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	token: null,
	isLoading: true,
	isAuthenticated: false,

	login: async (credentials: LoginRequest): Promise<AuthResult> => {
		try {
			const res = await apiLogin({ body: credentials });

			if (res.error || !res.data?.token) {
				const errorObj = res.error as { message?: string } | undefined;
				return { success: false, error: errorObj?.message };
			}

			const { token: newToken, user: userData } = res.data;

			setAuthToken(newToken);
			await setAuthCookieAction(newToken).catch(() => {});

			set({
				token: newToken,
				user: userData,
				isAuthenticated: true,
				isLoading: false,
			});

			return { success: true, user: userData };
		} catch (err: unknown) {
			const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
			const message = axiosErr?.response?.data?.message || axiosErr?.message;
			return { success: false, error: message };
		}
	},

	logout: () => {
		removeAuthToken();
		removeAuthCookieAction().catch(() => {});
		set({
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
		});
	},

	initialize: async () => {
		const storedToken = getAuthToken();
		if (!storedToken) {
			set({
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
			});
			return;
		}

		try {
			const res = await apiWhoami();
			if (res.data) {
				set({
					user: res.data,
					token: storedToken,
					isAuthenticated: true,
					isLoading: false,
				});
			} else {
				get().logout();
			}
		} catch {
			get().logout();
		} finally {
			set({ isLoading: false });
		}
	},
}));
