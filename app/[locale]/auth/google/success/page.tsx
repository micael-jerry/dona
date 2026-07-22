'use client';

import { useEffect, useState, use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuthStore } from '@/store/use-auth-store';
import { setAuthToken } from '@/lib/token';
import { setAuthCookieAction } from '@/app/actions/auth';
import { whoami as apiWhoami } from '@/lib/api';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export default function GoogleSuccessPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const tAuth = useTranslations('Auth');
	const tLogin = useTranslations('LoginPage');
	const locale = useLocale();

	const resolvedSearchParams = use(searchParams);

	const [status, setStatus] = useState<'verifying' | 'error'>('verifying');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function handleOAuthSuccess() {
			let token = typeof resolvedSearchParams.token === 'string' ? resolvedSearchParams.token : undefined;

			if (!token) {
				const rawKeys = Object.keys(resolvedSearchParams);
				const tokenKey = rawKeys.find((key) => key.startsWith('token=') || key.startsWith('token%3D'));
				if (tokenKey) {
					const parts = tokenKey.split(/=|%3D/i);
					token = parts[1];
				}
			}

			if (!token) {
				if (isMounted) {
					setStatus('error');
					setErrorMessage(tAuth('invalidCredentials'));
				}
				return;
			}

			try {
				// 1. Set token in client memory and document.cookie synchronously
				setAuthToken(token);

				// 2. Verify token against whoami endpoint
				const res = await apiWhoami();

				if (res.data) {
					// 3. Store cookie permanently in Next.js Server Action
					await setAuthCookieAction(token).catch(() => {});

					// 4. Update Zustand store state
					useAuthStore.setState({
						token,
						user: res.data,
						isAuthenticated: true,
						isLoading: false,
					});

					// 5. Navigate directly to dashboard via full window location to guarantee cookies are attached to middleware request
					if (isMounted) {
						window.location.href = `/${locale}/dashboard`;
					}
				} else {
					if (isMounted) {
						setStatus('error');
						setErrorMessage(tAuth('invalidCredentials'));
					}
				}
			} catch (err: unknown) {
				console.error(err);
				if (isMounted) {
					setStatus('error');
					setErrorMessage(tAuth('genericError'));
				}
			}
		}

		handleOAuthSuccess();

		return () => {
			isMounted = false;
		};
	}, [resolvedSearchParams, locale, tAuth]);

	if (status === 'verifying') {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background text-foreground">
				<div className="flex flex-col items-center gap-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 shadow-lg">
						<Loader2 className="h-8 w-8 animate-spin text-sky-500" />
					</div>
					<p className="animate-pulse text-sm font-semibold text-muted-foreground">{tAuth('checkingSession')}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
			<div className="flex max-w-md flex-col items-center gap-5 rounded-3xl border border-destructive/20 bg-card/80 p-8 text-center shadow-xl backdrop-blur-xl">
				<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
					<ShieldAlert className="h-7 w-7" />
				</div>
				<div className="space-y-2">
					<h3 className="text-xl font-bold text-foreground">{tAuth('accessRestricted')}</h3>
					<p className="text-sm font-medium text-muted-foreground">{errorMessage || tAuth('genericError')}</p>
				</div>
				<Link href="/login" className="w-full pt-2">
					<Button className="h-12 w-full rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]">
						{tLogin('submit')}
					</Button>
				</Link>
			</div>
		</div>
	);
}
