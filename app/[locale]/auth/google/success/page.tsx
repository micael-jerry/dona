'use client';

import { useEffect, useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/use-auth-store';
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
	const resolvedSearchParams = use(searchParams);

	const [status, setStatus] = useState<'verifying' | 'error'>('verifying');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function handleOAuthSuccess() {
			// ── 1. Extract token from all possible sources ─────────────────────
			let token: string | undefined;

			// 1a. Next.js searchParams (query string parsed server-side)
			if (typeof resolvedSearchParams.token === 'string') {
				token = resolvedSearchParams.token;
			}

			// 1b. Client-side window.location.search (fallback for SSR mismatches)
			if (!token && typeof window !== 'undefined') {
				const urlParams = new URLSearchParams(window.location.search);
				token = urlParams.get('token') ?? undefined;
			}

			// 1c. URL hash fragment (e.g. #token=eyJ... or #access_token=eyJ...)
			if (!token && typeof window !== 'undefined' && window.location.hash) {
				const hashParams = new URLSearchParams(window.location.hash.substring(1));
				token =
					hashParams.get('token') ??
					hashParams.get('access_token') ??
					hashParams.get('accessToken') ??
					hashParams.get('jwt') ??
					undefined;
			}

			// ── 2. No token found anywhere ────────────────────────────────────
			if (!token) {
				if (isMounted) {
					setStatus('error');
					setErrorMessage(tAuth('invalidCredentials'));
				}
				return;
			}

			try {
				// ── 3. Persist token in client cookie BEFORE calling whoami ───
				//       This makes the Axios interceptor send the Authorization header
				setAuthToken(token);

				// ── 4. Verify token against whoami endpoint ────────────────────
				const res = await apiWhoami();

				if (res.data && 'id' in res.data && !res.error) {
					// ── 5. Also persist in Next.js server cookie store ─────────
					await setAuthCookieAction(token).catch(() => {});

					// ── 6. Update Zustand store ────────────────────────────────
					useAuthStore.setState({
						token,
						user: res.data,
						isAuthenticated: true,
						isLoading: false,
					});

					// ── 7. Hard-navigate so middleware re-reads fresh cookies ──
					//       router.replace() is a SPA nav that races with the
					//       server cookie being available in the next request.
					//       window.location.href forces a full page reload with
					//       the cookie already set in document.cookie.
					if (isMounted) {
						window.location.href = '/dashboard';
					}
				} else {
					if (isMounted) {
						setStatus('error');
						setErrorMessage(tAuth('invalidCredentials'));
					}
				}
			} catch (err: unknown) {
				console.error('[GoogleSuccess] OAuth error:', err);
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
	}, [resolvedSearchParams, tAuth]);

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
