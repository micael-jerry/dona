'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, XCircle } from 'lucide-react';
import { zodV4Resolver } from '@/lib/resolvers';
import { createResetPasswordSchema, type ResetPasswordFormValues } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from '@/components/auth/password-strength-indicator';
import { resetPassword } from '@/lib/api';
import { Link } from '@/i18n/routing';

export function ResetPasswordForm({ token }: { token?: string }) {
	const t = useTranslations('ResetPasswordPage');
	const tAuth = useTranslations('Auth');

	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const resetPasswordSchema = createResetPasswordSchema({
		passwordMin: t('validation.passwordMin'),
		passwordMax: t('validation.passwordMax'),
		passwordsDontMatch: t('validation.passwordsDontMatch'),
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<ResetPasswordFormValues>({
		resolver: zodV4Resolver(resetPasswordSchema),
		defaultValues: { newPassword: '', confirmPassword: '' },
	});

	const newPasswordValue = useWatch({ control, name: 'newPassword', defaultValue: '' });

	if (!token) {
		return (
			<div className="flex flex-col items-center space-y-5 py-4 text-center">
				<div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-500 shadow-lg shadow-rose-500/20">
					<XCircle className="h-9 w-9" />
				</div>
				<h3 className="text-xl font-bold text-foreground">{t('invalidTokenTitle')}</h3>
				<p className="max-w-sm text-sm leading-relaxed font-medium text-muted-foreground">
					{t('invalidTokenDescription')}
				</p>
				<Link href="/forgot-password" className="w-full pt-2">
					<Button className="h-12 w-full rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 font-bold text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98]">
						{t('requestNewLink')}
					</Button>
				</Link>
			</div>
		);
	}

	if (isSuccess) {
		return (
			<div className="flex flex-col items-center space-y-5 py-4 text-center">
				<div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/20">
					<CheckCircle2 className="h-9 w-9" />
				</div>
				<h3 className="text-xl font-bold text-foreground">{t('successTitle')}</h3>
				<p className="max-w-sm text-sm leading-relaxed font-medium text-muted-foreground">{t('successDescription')}</p>
				<Link href="/login" className="w-full pt-2">
					<Button className="h-12 w-full rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 font-bold text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98]">
						{t('loginLink')}
					</Button>
				</Link>
			</div>
		);
	}

	async function onSubmit(values: ResetPasswordFormValues) {
		setIsSubmitting(true);
		setApiError(null);

		try {
			const res = await resetPassword({
				body: {
					resetPasswordToken: token as string,
					newPassword: values.newPassword,
				},
				throwOnError: false,
			});

			if (res.error) {
				const errMsg = res.error.message;
				if (Array.isArray(errMsg)) {
					setApiError(errMsg.join(', '));
				} else if (typeof errMsg === 'string') {
					setApiError(errMsg);
				} else {
					setApiError(tAuth('genericError'));
				}
			} else {
				setIsSuccess(true);
			}
		} catch (err: unknown) {
			const error = err as { message?: string };
			setApiError(error?.message || tAuth('genericError'));
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
			{apiError && (
				<div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm font-medium text-destructive">
					<AlertCircle className="h-5 w-5 shrink-0" />
					<span>{apiError}</span>
				</div>
			)}

			{/* New Password */}
			<div className="space-y-2">
				<Label htmlFor="reset-new-password" className="text-foreground/80">
					{t('newPasswordLabel')}
				</Label>
				<div className="relative">
					<Input
						id="reset-new-password"
						type={showNewPassword ? 'text' : 'password'}
						autoComplete="new-password"
						placeholder={t('newPasswordPlaceholder')}
						aria-invalid={!!errors.newPassword}
						aria-describedby="reset-password-strength reset-new-password-error"
						className="h-12 rounded-xl border-border/50 bg-background/50 pr-12 transition-all focus-visible:ring-primary/50"
						{...register('newPassword')}
					/>
					<button
						type="button"
						aria-label={showNewPassword ? 'Hide password' : 'Show password'}
						onClick={() => setShowNewPassword((v) => !v)}
						className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
					>
						{showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
					</button>
				</div>

				<PasswordStrengthIndicator password={newPasswordValue} />

				{errors.newPassword && (
					<p id="reset-new-password-error" role="alert" className="text-sm font-medium text-destructive">
						{errors.newPassword.message}
					</p>
				)}
			</div>

			{/* Confirm Password */}
			<div className="space-y-2">
				<Label htmlFor="reset-confirm-password" className="text-foreground/80">
					{t('confirmPasswordLabel')}
				</Label>
				<div className="relative">
					<Input
						id="reset-confirm-password"
						type={showConfirmPassword ? 'text' : 'password'}
						autoComplete="new-password"
						placeholder={t('confirmPasswordPlaceholder')}
						aria-invalid={!!errors.confirmPassword}
						aria-describedby={errors.confirmPassword ? 'reset-confirm-password-error' : undefined}
						className="h-12 rounded-xl border-border/50 bg-background/50 pr-12 transition-all focus-visible:ring-primary/50"
						{...register('confirmPassword')}
					/>
					<button
						type="button"
						aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
						onClick={() => setShowConfirmPassword((v) => !v)}
						className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
					>
						{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
					</button>
				</div>
				{errors.confirmPassword && (
					<p id="reset-confirm-password-error" role="alert" className="text-sm font-medium text-destructive">
						{errors.confirmPassword.message}
					</p>
				)}
			</div>

			<Button
				type="submit"
				disabled={isSubmitting}
				className="mt-2 h-12 w-full rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 font-bold text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98] disabled:scale-100"
			>
				{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
				{t('submit')}
			</Button>
		</form>
	);
}
