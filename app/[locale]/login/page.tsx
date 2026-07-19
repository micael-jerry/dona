'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, MapPin, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { zodV4Resolver } from '@/lib/resolvers';
import { createLoginSchema, type LoginFormValues } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
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
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
			{/* Decorative blobs */}
			<div className="pointer-events-none absolute top-0 left-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
			<div className="pointer-events-none absolute right-1/3 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/20 blur-[120px]" />

			<Card className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border-border/50 bg-background/60 shadow-2xl backdrop-blur-xl">
				<CardHeader className="space-y-3 pb-6 text-center">
					<div className="mb-2 flex justify-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<MapPin className="h-6 w-6 text-primary" />
						</div>
					</div>
					<CardTitle className="text-3xl font-bold tracking-tight">{t('title')}</CardTitle>
					<CardDescription className="font-medium text-muted-foreground">{t('description')}</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

						{/* Password */}
						<div className="space-y-2">
							<Label htmlFor="password" className="text-foreground/80">
								{t('passwordLabel')}
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									autoComplete="current-password"
									placeholder={t('passwordPlaceholder')}
									aria-invalid={!!errors.password}
									aria-describedby={errors.password ? 'password-error' : undefined}
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
								<p id="password-error" role="alert" className="text-sm font-medium text-destructive">
									{errors.password.message}
								</p>
							)}
						</div>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="mt-2 h-12 w-full rounded-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-[1.02] disabled:scale-100"
						>
							{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{t('submit')}
						</Button>
					</form>

					{/* OAuth separator */}
					<div className="relative flex items-center gap-4">
						<Separator className="flex-1 bg-border/50" />
						<span className="text-xs font-semibold text-muted-foreground uppercase">{t('orContinueWith')}</span>
						<Separator className="flex-1 bg-border/50" />
					</div>

					{/* Google OAuth */}
					<Button
						variant="outline"
						type="button"
						className="flex h-12 w-full items-center gap-3 rounded-xl border-border/50 bg-background/50 font-medium transition-colors hover:bg-muted"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						{t('googleButton')}
					</Button>
				</CardContent>

				<CardFooter className="flex justify-center border-t border-border/30 pt-6 pb-8">
					<p className="text-sm font-medium text-muted-foreground">
						{t('noAccount')}{' '}
						<Link href="/register" className="font-semibold text-primary hover:underline">
							{t('registerLink')}
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
