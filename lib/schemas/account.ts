import { z } from 'zod';

// ─── Update Profile Schema ───────────────────────────────────────────────────

export interface UpdateProfileMessages {
	nameMin: string;
	nameMax: string;
	pseudoMin: string;
	pseudoMax: string;
	pseudoRegex: string;
	emailInvalid: string;
}

export function createUpdateProfileSchema(messages: UpdateProfileMessages) {
	return z.object({
		name: z.string().min(3, { message: messages.nameMin }).max(100, { message: messages.nameMax }),
		pseudo: z
			.string()
			.min(5, { message: messages.pseudoMin })
			.max(25, { message: messages.pseudoMax })
			.regex(/^[a-zA-Z0-9_]+$/, { message: messages.pseudoRegex }),
		email: z.string().email({ message: messages.emailInvalid }),
	});
}

export type UpdateProfileFormValues = z.infer<ReturnType<typeof createUpdateProfileSchema>>;

// ─── Change Password Schema ──────────────────────────────────────────────────

export interface ChangePasswordMessages {
	currentPasswordRequired: string;
	newPasswordMin: string;
	newPasswordMax: string;
	passwordsDontMatch: string;
}

export function createChangePasswordSchema(messages: ChangePasswordMessages) {
	return z
		.object({
			currentPassword: z.string().min(1, { message: messages.currentPasswordRequired }),
			newPassword: z
				.string()
				.min(8, { message: messages.newPasswordMin })
				.max(100, { message: messages.newPasswordMax }),
			confirmPassword: z.string(),
		})
		.refine((data) => data.newPassword === data.confirmPassword, {
			message: messages.passwordsDontMatch,
			path: ['confirmPassword'],
		});
}

export type ChangePasswordFormValues = z.infer<ReturnType<typeof createChangePasswordSchema>>;

// ─── Delete Account Schema ───────────────────────────────────────────────────

export interface DeleteAccountMessages {
	passwordRequired: string;
}

export function createDeleteAccountSchema() {
	return z.object({
		password: z.string().optional(),
	});
}

export type DeleteAccountFormValues = z.infer<ReturnType<typeof createDeleteAccountSchema>>;
