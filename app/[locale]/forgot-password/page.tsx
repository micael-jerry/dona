import { getTranslations } from 'next-intl/server';
import { AuthCard } from '@/components/auth/auth-card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { KeyRound } from 'lucide-react';

export default async function ForgotPasswordPage() {
	const t = await getTranslations('ForgotPasswordPage');

	return (
		<AuthCard variant="login">
			<CardHeader className="space-y-3 pb-6 text-center">
				<div className="mb-2 flex justify-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 shadow-md">
						<KeyRound className="h-7 w-7 text-sky-500" />
					</div>
				</div>
				<CardTitle className="text-3xl font-black tracking-tight text-foreground">{t('title')}</CardTitle>
				<CardDescription className="text-sm font-medium text-muted-foreground">{t('description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<ForgotPasswordForm />
			</CardContent>
		</AuthCard>
	);
}
