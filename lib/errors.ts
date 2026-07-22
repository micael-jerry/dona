/**
 * Utility for parsing API error responses cleanly across the application.
 */
export function extractErrorMessage(error: unknown, fallbackMessage: string): string {
	if (!error) return fallbackMessage;

	if (typeof error === 'string') return error;

	if (Array.isArray(error)) return error.join(', ');

	const errObj = error as {
		message?: string | string[];
		error?: { message?: string | string[] };
		response?: { data?: { message?: string | string[] } };
	};

	const message = errObj.message || errObj.error?.message || errObj.response?.data?.message;

	if (Array.isArray(message)) {
		return message.join(', ');
	}

	if (typeof message === 'string') {
		return message;
	}

	return fallbackMessage;
}
