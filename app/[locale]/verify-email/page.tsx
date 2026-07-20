import { verifyEmail } from '@/lib/api';
import { Mail, CheckCircle, XCircle } from 'lucide-react';
import { AuthCard } from '@/components/auth/auth-card';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import { CloseWindowButton } from '@/components/auth/close-window-button';

export default async function VerifyEmailPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const t = await getTranslations('VerifyEmailPage');
	const params = await searchParams;
	let token = typeof params.token === 'string' ? params.token : undefined;

	if (!token) {
		const rawKeys = Object.keys(params);
		const tokenKey = rawKeys.find((key) => key.startsWith('token=') || key.startsWith('token%3D'));
		if (tokenKey) {
			const parts = tokenKey.split(/=|%3D/i);
			token = parts[1];
		}
	}

	let status: 'success' | 'error' | 'invalid' = 'invalid';

	if (token) {
		try {
			const res = await verifyEmail({
				body: { emailVerificationToken: token },
				throwOnError: false,
			});
			if (res.error) {
				console.error(res.error);
				status = 'error';
			} else {
				status = 'success';
			}
		} catch (err) {
			console.error(err);
			status = 'error';
		}
	}

	return (
		<AuthCard variant="login">
			<CardHeader className="space-y-3 pb-6 text-center">
				<div className="mb-2 flex justify-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Mail className="h-6 w-6 text-primary" />
					</div>
				</div>
				<CardTitle className="text-3xl font-bold tracking-tight">{t('title')}</CardTitle>
			</CardHeader>

			<CardContent className="flex min-h-37.5 flex-col items-center justify-center py-6 text-center">
				{status === 'success' && (
					<div className="flex flex-col items-center space-y-4">
						<CheckCircle className="h-14 w-14 text-green-500" />
						<h3 className="text-xl font-bold text-foreground">{t('successTitle')}</h3>
						<p className="max-w-sm font-medium text-muted-foreground">{t('successDescription')}</p>
					</div>
				)}

				{status === 'error' && (
					<div className="flex flex-col items-center space-y-4">
						<XCircle className="h-14 w-14 text-destructive" />
						<h3 className="text-xl font-bold text-foreground">{t('errorTitle')}</h3>
						<p className="max-w-sm font-medium text-muted-foreground">{t('errorDescription')}</p>
					</div>
				)}

				{status === 'invalid' && (
					<div className="flex flex-col items-center space-y-4">
						<XCircle className="h-14 w-14 text-destructive" />
						<h3 className="text-xl font-bold text-foreground">{t('errorTitle')}</h3>
						<p className="max-w-sm font-medium text-muted-foreground">{t('invalidToken')}</p>
					</div>
				)}
			</CardContent>

			<CardFooter className="flex flex-col justify-center gap-3 border-t border-border/30 pt-6 pb-8">
				<CloseWindowButton label={t('closeButton')} />
			</CardFooter>
		</AuthCard>
	);
}
