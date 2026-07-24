'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { AlertCircle, Check, Loader2, User, Mail, AtSign, Save } from 'lucide-react';
import { zodV4Resolver } from '@/lib/resolvers';
import { createUpdateProfileSchema, type UpdateProfileFormValues } from '@/lib/schemas/account';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateProfile, type UserResponse } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { extractErrorMessage } from '@/lib/errors';

interface ProfileFormProps {
	user: UserResponse;
}

export function ProfileForm({ user }: ProfileFormProps) {
	const t = useTranslations('AccountPage.profile');
	const tRegister = useTranslations('RegisterPage.validation');
	const tLogin = useTranslations('LoginPage.validation');
	const tCommon = useTranslations('Auth');
	const { setUser } = useAuth();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [apiError, setApiError] = useState<string | null>(null);

	const profileSchema = createUpdateProfileSchema({
		nameMin: tRegister('nameMin'),
		nameMax: tRegister('nameMax'),
		pseudoMin: tRegister('pseudoMin'),
		pseudoMax: tRegister('pseudoMax'),
		pseudoRegex: tRegister('pseudoRegex'),
		emailInvalid: tLogin('emailInvalid'),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<UpdateProfileFormValues>({
		resolver: zodV4Resolver(profileSchema),
		defaultValues: {
			name: user.name || '',
			pseudo: user.pseudo || '',
			email: user.email || '',
		},
	});

	async function onSubmit(values: UpdateProfileFormValues) {
		setIsSubmitting(true);
		setApiError(null);
		setSuccessMsg(null);

		try {
			const res = await updateProfile({
				body: {
					name: values.name,
					pseudo: values.pseudo,
					email: values.email,
				},
			});

			if (res.error || !res.data) {
				setApiError(extractErrorMessage(res.error, tCommon('genericError')));
			} else {
				setUser(res.data);
				setSuccessMsg(t('successMessage'));
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

			<div className="grid gap-5 sm:grid-cols-2">
				{/* Pseudo */}
				<div className="space-y-2">
					<Label htmlFor="account-pseudo" className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
						<AtSign className="h-3.5 w-3.5 text-sky-500" />
						{t('pseudoLabel')}
					</Label>
					<Input
						id="account-pseudo"
						type="text"
						placeholder={t('pseudoPlaceholder')}
						aria-invalid={!!errors.pseudo}
						aria-describedby={errors.pseudo ? 'account-pseudo-error' : undefined}
						className="h-11 rounded-xl border-border/50 bg-background/50 text-sm transition-all focus-visible:ring-primary/50"
						{...register('pseudo')}
					/>
					{errors.pseudo && (
						<p id="account-pseudo-error" role="alert" className="text-xs font-medium text-destructive">
							{errors.pseudo.message}
						</p>
					)}
				</div>

				{/* Full Name */}
				<div className="space-y-2">
					<Label htmlFor="account-name" className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
						<User className="h-3.5 w-3.5 text-sky-500" />
						{t('nameLabel')}
					</Label>
					<Input
						id="account-name"
						type="text"
						placeholder={t('namePlaceholder')}
						aria-invalid={!!errors.name}
						aria-describedby={errors.name ? 'account-name-error' : undefined}
						className="h-11 rounded-xl border-border/50 bg-background/50 text-sm transition-all focus-visible:ring-primary/50"
						{...register('name')}
					/>
					{errors.name && (
						<p id="account-name-error" role="alert" className="text-xs font-medium text-destructive">
							{errors.name.message}
						</p>
					)}
				</div>

				{/* Email */}
				<div className="space-y-2 sm:col-span-2">
					<Label htmlFor="account-email" className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
						<Mail className="h-3.5 w-3.5 text-sky-500" />
						{t('emailLabel')}
					</Label>
					<Input
						id="account-email"
						type="email"
						placeholder={t('emailPlaceholder')}
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? 'account-email-error' : undefined}
						className="h-11 rounded-xl border-border/50 bg-background/50 text-sm transition-all focus-visible:ring-primary/50"
						{...register('email')}
					/>
					{errors.email && (
						<p id="account-email-error" role="alert" className="text-xs font-medium text-destructive">
							{errors.email.message}
						</p>
					)}
				</div>
			</div>

			{/* Submit Button */}
			<div className="flex justify-end pt-2">
				<Button
					type="submit"
					disabled={isSubmitting || !isDirty}
					className="h-11 rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 px-6 font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] disabled:scale-100 disabled:opacity-50"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t('saving')}
						</>
					) : (
						<>
							<Save className="mr-2 h-4 w-4" />
							{t('submit')}
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
