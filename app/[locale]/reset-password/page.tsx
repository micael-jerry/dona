import { getTranslations } from 'next-intl/server';
import { AuthCard } from '@/components/auth/auth-card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { KeyRound } from 'lucide-react';

export default async function ResetPasswordPage({
	searchParams,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	searchParams: Promise<{ [key: string]: string | string[] | undefined }> | Promise<any>;
}) {
	const t = await getTranslations('ResetPasswordPage');
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
				<ResetPasswordForm token={token} />
			</CardContent>
		</AuthCard>
	);
}
