import { z } from 'zod';

// ─── Login ────────────────────────────────────────────────────────────────────

export interface LoginMessages {
	emailInvalid: string;
	passwordMin: string;
	passwordMax: string;
}

export function createLoginSchema(messages: LoginMessages) {
	return z.object({
		email: z.string().email({ message: messages.emailInvalid }),
		password: z.string().min(8, { message: messages.passwordMin }).max(100, { message: messages.passwordMax }),
	});
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

// ─── Register ─────────────────────────────────────────────────────────────────

export interface RegisterMessages {
	pseudoMin: string;
	pseudoMax: string;
	pseudoRegex: string;
	nameMin: string;
	nameMax: string;
	emailInvalid: string;
	passwordMin: string;
	passwordMax: string;
}

export function createRegisterSchema(messages: RegisterMessages) {
	return z.object({
		pseudo: z
			.string()
			.min(5, { message: messages.pseudoMin })
			.max(25, { message: messages.pseudoMax })
			.regex(/^[a-zA-Z0-9_]+$/, { message: messages.pseudoRegex }),
		name: z.string().min(3, { message: messages.nameMin }).max(100, { message: messages.nameMax }),
		email: z.string().email({ message: messages.emailInvalid }),
		password: z.string().min(8, { message: messages.passwordMin }).max(100, { message: messages.passwordMax }),
	});
}

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

// ─── Forgot Password ──────────────────────────────────────────────────────────

export interface ForgotPasswordMessages {
	emailInvalid: string;
}

export function createForgotPasswordSchema(messages: ForgotPasswordMessages) {
	return z.object({
		email: z.string().email({ message: messages.emailInvalid }),
	});
}

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>;

// ─── Reset Password ───────────────────────────────────────────────────────────

export interface ResetPasswordMessages {
	passwordMin: string;
	passwordMax: string;
	passwordsDontMatch: string;
}

export function createResetPasswordSchema(messages: ResetPasswordMessages) {
	return z
		.object({
			newPassword: z.string().min(8, { message: messages.passwordMin }).max(100, { message: messages.passwordMax }),
			confirmPassword: z.string(),
		})
		.refine((data) => data.newPassword === data.confirmPassword, {
			message: messages.passwordsDontMatch,
			path: ['confirmPassword'],
		});
}

export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>;
