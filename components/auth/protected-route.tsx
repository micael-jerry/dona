'use client';

import { useEffect, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from '@/i18n/routing';
import { Loader2, ShieldAlert } from 'lucide-react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
	const tAuth = useTranslations('Auth');
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push('/login');
		}
	}, [isLoading, isAuthenticated, router]);

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background text-foreground">
				<div className="flex flex-col items-center gap-4">
					<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 shadow-lg">
						<Loader2 className="h-7 w-7 animate-spin text-sky-500" />
					</div>
					<p className="animate-pulse text-sm font-semibold text-muted-foreground">{tAuth('checkingSession')}</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background text-foreground">
				<div className="flex flex-col items-center gap-4 text-center">
					<ShieldAlert className="h-10 w-10 text-amber-500" />
					<p className="text-sm font-semibold text-muted-foreground">{tAuth('accessRestricted')}</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
