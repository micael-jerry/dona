'use client';

import { useTranslations } from 'next-intl';
import { LogOut, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export function UserNav() {
	const t = useTranslations('HomePage');
	const tAuth = useTranslations('Auth');
	const { user, isAuthenticated, isLoading, logout } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center px-4">
				<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isAuthenticated && user) {
		return (
			<div className="flex items-center gap-3">
				<Link
					href="/dashboard"
					className="flex items-center gap-2.5 rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 shadow-xs transition-all hover:scale-[1.02] hover:border-sky-500/40"
				>
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-xs font-bold text-white uppercase">
						{user.pseudo ? user.pseudo.charAt(0) : <User className="h-3.5 w-3.5" />}
					</div>
					<div className="hidden flex-col text-left sm:flex">
						<span className="text-xs leading-tight font-bold text-foreground">{user.pseudo}</span>
						<span className="text-[10px] font-medium text-muted-foreground">{user.email}</span>
					</div>
				</Link>

				<Button
					variant="ghost"
					size="icon"
					onClick={logout}
					title={tAuth('logout')}
					className="h-9 w-9 rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
				>
					<LogOut className="h-4 w-4" />
				</Button>
			</div>
		);
	}

	return (
		<Link href="/login" className="hidden sm:inline-flex">
			<Button variant="ghost" className="font-semibold text-muted-foreground hover:text-foreground">
				{t('login')}
			</Button>
		</Link>
	);
}
