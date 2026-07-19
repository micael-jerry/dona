'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { zodV4Resolver } from '@/lib/resolvers';
import { createRegisterSchema, type RegisterFormValues } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from '@/components/auth/password-strength-indicator';

export function RegisterForm() {
	const t = useTranslations('RegisterPage');
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const registerSchema = createRegisterSchema({
		pseudoMin: t('validation.pseudoMin'),
		pseudoMax: t('validation.pseudoMax'),
		pseudoRegex: t('validation.pseudoRegex'),
		nameMin: t('validation.nameMin'),
		nameMax: t('validation.nameMax'),
		emailInvalid: t('validation.emailInvalid'),
		passwordMin: t('validation.passwordMin'),
		passwordMax: t('validation.passwordMax'),
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<RegisterFormValues>({
		resolver: zodV4Resolver(registerSchema),
		defaultValues: { pseudo: '', name: '', email: '', password: '' },
	});

	const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });

	async function onSubmit(values: RegisterFormValues) {
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
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
			{/* Pseudo + Name row */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="register-pseudo" className="text-foreground/80">
						{t('pseudoLabel')}
					</Label>
					<Input
						id="register-pseudo"
						autoComplete="username"
						placeholder={t('pseudoPlaceholder')}
						aria-invalid={!!errors.pseudo}
						aria-describedby={errors.pseudo ? 'pseudo-error' : undefined}
						className="h-12 rounded-xl border-border/50 bg-background/50 transition-all focus-visible:ring-primary/50"
						{...register('pseudo')}
					/>
					{errors.pseudo && (
						<p id="pseudo-error" role="alert" className="text-sm font-medium text-destructive">
							{errors.pseudo.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="register-name" className="text-foreground/80">
						{t('nameLabel')}
					</Label>
					<Input
						id="register-name"
						autoComplete="name"
						placeholder={t('namePlaceholder')}
						aria-invalid={!!errors.name}
						aria-describedby={errors.name ? 'name-error' : undefined}
						className="h-12 rounded-xl border-border/50 bg-background/50 transition-all focus-visible:ring-primary/50"
						{...register('name')}
					/>
					{errors.name && (
						<p id="name-error" role="alert" className="text-sm font-medium text-destructive">
							{errors.name.message}
						</p>
					)}
				</div>
			</div>

			{/* Email */}
			<div className="space-y-2">
				<Label htmlFor="register-email" className="text-foreground/80">
					{t('emailLabel')}
				</Label>
				<Input
					id="register-email"
					type="email"
					autoComplete="email"
					placeholder={t('emailPlaceholder')}
					aria-invalid={!!errors.email}
					aria-describedby={errors.email ? 'email-error' : undefined}
					className="h-12 rounded-xl border-border/50 bg-background/50 transition-all focus-visible:ring-primary/50"
					{...register('email')}
				/>
				{errors.email && (
					<p id="email-error" role="alert" className="text-sm font-medium text-destructive">
						{errors.email.message}
					</p>
				)}
			</div>

			{/* Password + strength */}
			<div className="space-y-2">
				<Label htmlFor="register-password" className="text-foreground/80">
					{t('passwordLabel')}
				</Label>
				<div className="relative">
					<Input
						id="register-password"
						type={showPassword ? 'text' : 'password'}
						autoComplete="new-password"
						placeholder={t('passwordPlaceholder')}
						aria-invalid={!!errors.password}
						aria-describedby="password-strength password-error"
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

				<PasswordStrengthIndicator password={passwordValue} />

				{errors.password && (
					<p id="password-error" role="alert" className="text-sm font-medium text-destructive">
						{errors.password.message}
					</p>
				)}
			</div>

			<Button
				type="submit"
				disabled={isSubmitting}
				className="mt-4 h-12 w-full rounded-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-[1.02] disabled:scale-100"
			>
				{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				{t('submit')}
			</Button>
		</form>
	);
}
