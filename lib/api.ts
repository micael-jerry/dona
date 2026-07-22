import { client } from '@/client/client.gen';
import { getAuthToken, removeAuthToken } from '@/lib/token';

// Set API Base URL
client.setConfig({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dona-api-theta.vercel.app',
});

// Request Interceptor: Automatically inject Authorization header into every request made via generated client
client.instance.interceptors.request.use(
	(config) => {
		const token = getAuthToken();
		if (token) {
			config.headers = config.headers || {};
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response Interceptor: Clean up token automatically on 401 Unauthorized responses
client.instance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			removeAuthToken();
		}
		return Promise.reject(error);
	},
);

export * from '@/client';
export { client };
