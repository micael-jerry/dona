'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { Eye, EyeOff, MapPin, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { zodV4Resolver } from '@/lib/resolvers';
import { createRegisterSchema, type RegisterFormValues } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// ─── Password strength ────────────────────────────────────────────────────────

type PasswordStrength = 'weak' | 'medium' | 'strong';

function computeStrength(password: string): PasswordStrength {
	if (password.length < 8) return 'weak';
	let score = 0;
	if (/[a-z]/.test(password)) score++;
	if (/[A-Z]/.test(password)) score++;
	if (/[0-9]/.test(password)) score++;
	if (/[^a-zA-Z0-9]/.test(password)) score++;
	if (score <= 2) return 'weak';
	if (score === 3) return 'medium';
	return 'strong';
}

const strengthConfig: Record<PasswordStrength, { segments: number; color: string }> = {
	weak: { segments: 1, color: 'bg-destructive' },
	medium: { segments: 2, color: 'bg-accent' },
	strong: { segments: 3, color: 'bg-green-500' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
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

	// Live password value for the strength indicator
	const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });
	const strength = computeStrength(passwordValue);
	const { segments, color } = strengthConfig[strength];

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
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
			{/* Decorative blobs */}
			<div className="pointer-events-none absolute top-0 right-1/3 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]" />
			<div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />

			<Card className="relative z-10 my-8 w-full max-w-lg overflow-hidden rounded-3xl border-border/50 bg-background/60 shadow-2xl backdrop-blur-xl">
				<CardHeader className="space-y-3 pb-6 text-center">
					<div className="mb-2 flex justify-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
							<MapPin className="h-6 w-6 text-accent" />
						</div>
					</div>
					<CardTitle className="text-3xl font-bold tracking-tight">{t('title')}</CardTitle>
					<CardDescription className="font-medium text-muted-foreground">{t('description')}</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
						{/* Pseudo + Name row */}
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="pseudo" className="text-foreground/80">
									{t('pseudoLabel')}
								</Label>
								<Input
									id="pseudo"
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
								<Label htmlFor="name" className="text-foreground/80">
									{t('nameLabel')}
								</Label>
								<Input
									id="name"
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
							<Label htmlFor="email" className="text-foreground/80">
								{t('emailLabel')}
							</Label>
							<Input
								id="email"
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
							<Label htmlFor="password" className="text-foreground/80">
								{t('passwordLabel')}
							</Label>
							<div className="relative">
								<Input
									id="password"
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

							{/* Strength indicator — only shown when user has typed */}
							{passwordValue.length > 0 && (
								<div id="password-strength" aria-live="polite" className="space-y-1.5">
									<div
										className="flex gap-1.5"
										role="meter"
										aria-valuemin={0}
										aria-valuemax={3}
										aria-valuenow={segments}
										aria-label={t('passwordStrength.label')}
									>
										{[1, 2, 3].map((seg) => (
											<div
												key={seg}
												className={[
													'h-1.5 flex-1 rounded-full transition-all duration-300',
													seg <= segments ? color : 'bg-border',
												].join(' ')}
											/>
										))}
									</div>
									<p className="text-xs font-medium text-muted-foreground">
										{t('passwordStrength.label')} :{' '}
										<span
											className={
												strength === 'strong'
													? 'text-green-500'
													: strength === 'medium'
														? 'text-accent'
														: 'text-destructive'
											}
										>
											{t(`passwordStrength.${strength}`)}
										</span>
									</p>
								</div>
							)}

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
				</CardContent>

				<CardFooter className="flex justify-center border-t border-border/30 pt-6 pb-8">
					<p className="text-sm font-medium text-muted-foreground">
						{t('hasAccount')}{' '}
						<Link href="/login" className="font-semibold text-primary hover:underline">
							{t('loginLink')}
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
