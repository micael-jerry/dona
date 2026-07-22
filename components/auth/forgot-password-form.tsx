'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { zodV4Resolver } from '@/lib/resolvers';
import { createForgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordRequest } from '@/lib/api';
import { Link } from '@/i18n/routing';

export function ForgotPasswordForm() {
	const t = useTranslations('ForgotPasswordPage');
	const tAuth = useTranslations('Auth');

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const forgotPasswordSchema = createForgotPasswordSchema({
		emailInvalid: t('validation.emailInvalid'),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormValues>({
		resolver: zodV4Resolver(forgotPasswordSchema),
		defaultValues: { email: '' },
	});

	async function onSubmit(values: ForgotPasswordFormValues) {
		setIsSubmitting(true);
		setApiError(null);

		try {
			const res = await resetPasswordRequest({
				body: { email: values.email },
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
						{t('backToLogin')}
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
			{apiError && (
				<div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm font-medium text-destructive">
					<AlertCircle className="h-5 w-5 shrink-0" />
					<span>{apiError}</span>
				</div>
			)}

			<div className="space-y-2">
				<Label htmlFor="forgot-email" className="text-foreground/80">
					{t('emailLabel')}
				</Label>
				<div className="relative">
					<Input
						id="forgot-email"
						type="email"
						autoComplete="email"
						placeholder={t('emailPlaceholder')}
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? 'forgot-email-error' : undefined}
						className="h-12 rounded-xl border-border/50 bg-background/50 pr-10 transition-all focus-visible:ring-primary/50"
						{...register('email')}
					/>
					<Mail className="absolute top-1/2 right-3.5 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
				</div>
				{errors.email && (
					<p id="forgot-email-error" role="alert" className="text-sm font-medium text-destructive">
						{errors.email.message}
					</p>
				)}
			</div>

			<Button
				type="submit"
				disabled={isSubmitting}
				className="h-12 w-full rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 font-bold text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98] disabled:scale-100"
			>
				{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				{t('submit')}
			</Button>

			<div className="pt-2 text-center">
				<Link
					href="/login"
					className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
				>
					{t('backToLogin')}
				</Link>
			</div>
		</form>
	);
}
