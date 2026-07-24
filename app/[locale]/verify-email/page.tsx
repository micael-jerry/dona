import { verifyEmail } from '@/lib/api';
import { Mail, CheckCircle2, XCircle } from 'lucide-react';
import { AuthCard } from '@/components/auth/auth-card';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import { CloseWindowButton } from '@/components/auth/close-window-button';

export default async function VerifyEmailPage({
	searchParams,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	searchParams: Promise<{ [key: string]: string | string[] | undefined }> | Promise<any>;
}) {
	const t = await getTranslations('VerifyEmailPage');
	const params = (await searchParams) as { [key: string]: string | string[] | undefined };
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
			<CardHeader className="space-y-3 pb-4 text-center">
				<div className="mb-2 flex justify-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 shadow-md">
						<Mail className="h-7 w-7 text-sky-500" />
					</div>
				</div>
				<CardTitle className="text-3xl font-black tracking-tight text-foreground">{t('title')}</CardTitle>
			</CardHeader>

			<CardContent className="flex min-h-44 flex-col items-center justify-center py-6 text-center">
				{status === 'success' && (
					<div className="flex flex-col items-center space-y-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/20">
							<CheckCircle2 className="h-9 w-9" />
						</div>
						<h3 className="text-xl font-bold text-foreground">{t('successTitle')}</h3>
						<p className="max-w-sm text-sm leading-relaxed font-medium text-muted-foreground">
							{t('successDescription')}
						</p>
					</div>
				)}

				{status === 'error' && (
					<div className="flex flex-col items-center space-y-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-500 shadow-lg shadow-rose-500/20">
							<XCircle className="h-9 w-9" />
						</div>
						<h3 className="text-xl font-bold text-foreground">{t('errorTitle')}</h3>
						<p className="max-w-sm text-sm leading-relaxed font-medium text-muted-foreground">
							{t('errorDescription')}
						</p>
					</div>
				)}

				{status === 'invalid' && (
					<div className="flex flex-col items-center space-y-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-500 shadow-lg shadow-rose-500/20">
							<XCircle className="h-9 w-9" />
						</div>
						<h3 className="text-xl font-bold text-foreground">{t('errorTitle')}</h3>
						<p className="max-w-sm text-sm leading-relaxed font-medium text-muted-foreground">{t('invalidToken')}</p>
					</div>
				)}
			</CardContent>

			<CardFooter className="flex flex-col justify-center gap-3 border-t border-border/30 pt-6 pb-6">
				<CloseWindowButton label={t('closeButton')} />
			</CardFooter>
		</AuthCard>
	);
}
