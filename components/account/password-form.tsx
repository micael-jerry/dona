'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { AlertCircle, Check, Eye, EyeOff, Loader2, KeyRound, ShieldAlert } from 'lucide-react';
import { zodV4Resolver } from '@/lib/resolvers';
import { createChangePasswordSchema, type ChangePasswordFormValues } from '@/lib/schemas/account';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordStrengthIndicator } from '@/components/auth/password-strength-indicator';
import { changePassword, type UserResponse } from '@/lib/api';
import { extractErrorMessage } from '@/lib/errors';

interface PasswordFormProps {
	user: UserResponse;
}

export function PasswordForm({ user }: PasswordFormProps) {
	const t = useTranslations('AccountPage.password');
	const tRegister = useTranslations('RegisterPage.validation');
	const tReset = useTranslations('ResetPasswordPage.validation');
	const tCommon = useTranslations('Auth');

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [apiError, setApiError] = useState<string | null>(null);

	const passwordSchema = createChangePasswordSchema({
		currentPasswordRequired: t('currentPasswordRequired'),
		newPasswordMin: tRegister('passwordMin'),
		newPasswordMax: tRegister('passwordMax'),
		passwordsDontMatch: tReset('passwordsDontMatch'),
	});

	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<ChangePasswordFormValues>({
		resolver: zodV4Resolver(passwordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	const watchedNewPassword = watch('newPassword');

	if (user.isOAuthGoogleProvider) {
		return (
			<Alert className="rounded-2xl border-amber-500/30 bg-amber-500/10 p-5 text-amber-500">
				<ShieldAlert className="h-5 w-5" />
				<AlertDescription className="text-sm leading-relaxed font-medium">{t('googleOAuthNotice')}</AlertDescription>
			</Alert>
		);
	}

	async function onSubmit(values: ChangePasswordFormValues) {
		setIsSubmitting(true);
		setApiError(null);
		setSuccessMsg(null);

		try {
			const res = await changePassword({
				body: {
					currentPassword: values.currentPassword,
					newPassword: values.newPassword,
				},
			});

			if (res.error || !res.data) {
				setApiError(extractErrorMessage(res.error, tCommon('genericError')));
			} else {
				setSuccessMsg(t('successMessage'));
				reset();
			}
		} catch (err: unknown) {
			setApiError(extractErrorMessage(err, tCommon('genericError')));
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
			{/* Feedback Alerts */}
			{successMsg && (
				<Alert className="rounded-xl border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
					<Check className="h-4 w-4" />
					<AlertDescription className="font-medium">{successMsg}</AlertDescription>
				</Alert>
			)}

			{apiError && (
				<Alert variant="destructive" className="rounded-xl border-destructive/30 bg-destructive/10">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription className="font-medium">{apiError}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-4">
				{/* Current Password */}
				<div className="space-y-2">
					<Label htmlFor="current-password" className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
						<KeyRound className="h-3.5 w-3.5 text-sky-500" />
						{t('currentPasswordLabel')}
					</Label>
					<div className="relative">
						<Input
							id="current-password"
							type={showCurrentPassword ? 'text' : 'password'}
							placeholder={t('currentPasswordPlaceholder')}
							aria-invalid={!!errors.currentPassword}
							aria-describedby={errors.currentPassword ? 'current-password-error' : undefined}
							className="h-11 rounded-xl border-border/50 bg-background/50 pr-12 text-sm transition-all focus-visible:ring-primary/50"
							{...register('currentPassword')}
						/>
						<button
							type="button"
							aria-label={showCurrentPassword ? t('hidePassword') : t('showPassword')}
							onClick={() => setShowCurrentPassword((v) => !v)}
							className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
						>
							{showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
					{errors.currentPassword && (
						<p id="current-password-error" role="alert" className="text-xs font-medium text-destructive">
							{errors.currentPassword.message}
						</p>
					)}
				</div>

				{/* New Password */}
				<div className="space-y-2">
					<Label htmlFor="new-password" className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
						<KeyRound className="h-3.5 w-3.5 text-sky-500" />
						{t('newPasswordLabel')}
					</Label>
					<div className="relative">
						<Input
							id="new-password"
							type={showNewPassword ? 'text' : 'password'}
							placeholder={t('newPasswordPlaceholder')}
							aria-invalid={!!errors.newPassword}
							aria-describedby={errors.newPassword ? 'new-password-error' : undefined}
							className="h-11 rounded-xl border-border/50 bg-background/50 pr-12 text-sm transition-all focus-visible:ring-primary/50"
							{...register('newPassword')}
						/>
						<button
							type="button"
							aria-label={showNewPassword ? t('hidePassword') : t('showPassword')}
							onClick={() => setShowNewPassword((v) => !v)}
							className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
						>
							{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
					<PasswordStrengthIndicator password={watchedNewPassword || ''} />
					{errors.newPassword && (
						<p id="new-password-error" role="alert" className="text-xs font-medium text-destructive">
							{errors.newPassword.message}
						</p>
					)}
				</div>

				{/* Confirm Password */}
				<div className="space-y-2">
					<Label htmlFor="confirm-password" className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
						<KeyRound className="h-3.5 w-3.5 text-sky-500" />
						{t('confirmPasswordLabel')}
					</Label>
					<div className="relative">
						<Input
							id="confirm-password"
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder={t('confirmPasswordPlaceholder')}
							aria-invalid={!!errors.confirmPassword}
							aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
							className="h-11 rounded-xl border-border/50 bg-background/50 pr-12 text-sm transition-all focus-visible:ring-primary/50"
							{...register('confirmPassword')}
						/>
						<button
							type="button"
							aria-label={showConfirmPassword ? t('hidePassword') : t('showPassword')}
							onClick={() => setShowConfirmPassword((v) => !v)}
							className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
						>
							{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
					{errors.confirmPassword && (
						<p id="confirm-password-error" role="alert" className="text-xs font-medium text-destructive">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>
			</div>

			{/* Submit Button */}
			<div className="flex justify-end pt-2">
				<Button
					type="submit"
					disabled={isSubmitting}
					className="h-11 rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 px-6 font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t('updating')}
						</>
					) : (
						<>
							<KeyRound className="mr-2 h-4 w-4" />
							{t('submit')}
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
