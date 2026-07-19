'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { zodV4Resolver } from '@/lib/resolvers';
import { createLoginSchema, type LoginFormValues } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { GoogleOAuthButton } from '@/components/auth/google-oauth-button';

export function LoginForm() {
	const t = useTranslations('LoginPage');
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const loginSchema = createLoginSchema({
		emailInvalid: t('validation.emailInvalid'),
		passwordMin: t('validation.passwordMin'),
		passwordMax: t('validation.passwordMax'),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodV4Resolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	async function onSubmit(values: LoginFormValues) {
		setIsSubmitting(true);
		try {
			// TODO: appel API
			console.log(values);
			await new Promise((r) => setTimeout(r, 1000));
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
			{/* Fields */}
			<div className="space-y-4">
				{/* Email */}
				<div className="space-y-2">
					<Label htmlFor="login-email" className="text-foreground/80">
						{t('emailLabel')}
					</Label>
					<Input
						id="login-email"
						type="email"
						autoComplete="email"
						placeholder={t('emailPlaceholder')}
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? 'login-email-error' : undefined}
						className="h-12 rounded-xl border-border/50 bg-background/50 transition-all focus-visible:ring-primary/50"
						{...register('email')}
					/>
					{errors.email && (
						<p id="login-email-error" role="alert" className="text-sm font-medium text-destructive">
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Password */}
				<div className="space-y-2">
					<Label htmlFor="login-password" className="text-foreground/80">
						{t('passwordLabel')}
					</Label>
					<div className="relative">
						<Input
							id="login-password"
							type={showPassword ? 'text' : 'password'}
							autoComplete="current-password"
							placeholder={t('passwordPlaceholder')}
							aria-invalid={!!errors.password}
							aria-describedby={errors.password ? 'login-password-error' : undefined}
							className="h-12 rounded-xl border-border/50 bg-background/50 pr-12 transition-all focus-visible:ring-primary/50"
							{...register('password')}
						/>
						<button
							type="button"
							aria-label={showPassword ? t('hidePassword') : t('showPassword')}
							onClick={() => setShowPassword((v) => !v)}
							className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
						>
							{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
					</div>
					{errors.password && (
						<p id="login-password-error" role="alert" className="text-sm font-medium text-destructive">
							{errors.password.message}
						</p>
					)}
				</div>
			</div>

			<Button
				type="submit"
				disabled={isSubmitting}
				className="h-12 w-full rounded-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-[1.02] disabled:scale-100"
			>
				{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				{t('submit')}
			</Button>

			{/* OAuth separator */}
			<div className="relative flex items-center gap-4">
				<Separator className="flex-1 bg-border/50" />
				<span className="text-xs font-semibold text-muted-foreground uppercase">{t('orContinueWith')}</span>
				<Separator className="flex-1 bg-border/50" />
			</div>

			<GoogleOAuthButton />
		</form>
	);
}
