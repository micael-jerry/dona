'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Calendar, MapPin, Sparkles, Clock, CheckCircle2, XCircle, User } from 'lucide-react';

export default function DashboardPage() {
	const t = useTranslations('DashboardPage');
	const tAuth = useTranslations('Auth');
	const { user, logout } = useAuth();

	if (!user) return null;

	const formattedCreatedAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
	const formattedUpdatedAt = user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A';
	const avatarUrl = typeof user.avatar === 'string' ? user.avatar : undefined;
	const fallbackLetter = user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U';

	return (
		<div className="mx-auto max-w-6xl space-y-8 py-4">
			{/* Welcome Banner */}
			<div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-linear-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 p-6 shadow-xl backdrop-blur-xl sm:p-8">
				<div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
				<div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-4">
						<Avatar className="h-16 w-16 rounded-2xl border border-sky-500/30 shadow-inner">
							<AvatarImage src={avatarUrl} alt={user.pseudo} />
							<AvatarFallback className="rounded-2xl bg-sky-500/20 text-2xl font-black text-sky-400">
								{fallbackLetter}
							</AvatarFallback>
						</Avatar>

						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
									{t('welcome')} {user.pseudo || user.name}!
								</h1>
								<Badge
									variant="outline"
									className="gap-1 rounded-full border-sky-500/30 bg-sky-500/15 text-xs font-bold text-sky-400"
								>
									<Sparkles className="h-3 w-3" />
									{user.role}
								</Badge>
							</div>
							<p className="text-sm font-medium text-muted-foreground">{t('subtitle')}</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<Link href="/account">
							<Button
								variant="outline"
								className="rounded-xl border-sky-500/30 bg-sky-500/10 font-bold text-sky-400 hover:bg-sky-500/20"
							>
								<User className="mr-2 h-4 w-4" />
								{t('manageAccount')}
							</Button>
						</Link>
						<Link href="/map">
							<Button className="rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98]">
								<MapPin className="mr-2 h-4 w-4" />
								{t('backHome')}
							</Button>
						</Link>
						<Button
							variant="outline"
							onClick={logout}
							className="rounded-xl border-border/50 bg-background/50 font-semibold transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
						>
							{tAuth('logout')}
						</Button>
					</div>
				</div>
			</div>

			{/* Details Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* Profile Card */}
				<Card className="rounded-2xl border-border/40 bg-card/60 shadow-md backdrop-blur-xl transition-all hover:border-sky-500/30">
					<CardHeader className="flex flex-row items-center justify-between pb-3">
						<CardTitle className="text-base font-bold text-foreground">{t('profileCardTitle')}</CardTitle>
						<Avatar className="h-6 w-6">
							<AvatarImage src={avatarUrl} alt={user.pseudo} />
							<AvatarFallback className="bg-sky-500 text-[10px] font-bold text-white">{fallbackLetter}</AvatarFallback>
						</Avatar>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<div className="flex justify-between border-b border-border/30 pb-2.5">
							<span className="font-medium text-muted-foreground">{t('pseudoLabel')}</span>
							<span className="font-bold text-foreground">{user.pseudo}</span>
						</div>
						<div className="flex justify-between border-b border-border/30 pb-2.5">
							<span className="font-medium text-muted-foreground">{t('nameLabel')}</span>
							<span className="font-bold text-foreground">{user.name || 'N/A'}</span>
						</div>
						<div className="flex justify-between border-b border-border/30 pb-2.5">
							<span className="font-medium text-muted-foreground">{t('roleLabel')}</span>
							<Badge variant="outline" className="border-primary/20 bg-primary/10 text-xs font-bold text-primary">
								{user.role}
							</Badge>
						</div>
						<div className="flex justify-between pt-1">
							<span className="font-medium text-muted-foreground">ID</span>
							<span className="max-w-35 truncate font-mono text-xs font-semibold text-muted-foreground" title={user.id}>
								{user.id}
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Security & Auth Card */}
				<Card className="rounded-2xl border-border/40 bg-card/60 shadow-md backdrop-blur-xl transition-all hover:border-sky-500/30">
					<CardHeader className="flex flex-row items-center justify-between pb-3">
						<CardTitle className="text-base font-bold text-foreground">{t('statusLabel')}</CardTitle>
						<ShieldCheck className="h-5 w-5 text-emerald-500" />
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<div className="flex justify-between border-b border-border/30 pb-2.5">
							<span className="font-medium text-muted-foreground">{t('emailLabel')}</span>
							<span className="max-w-40 truncate font-bold text-foreground" title={user.email}>
								{user.email}
							</span>
						</div>
						<div className="flex items-center justify-between border-b border-border/30 pb-2.5">
							<span className="font-medium text-muted-foreground">{t('verificationLabel')}</span>
							{user.isEmailVerified ? (
								<Badge
									variant="outline"
									className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-500"
								>
									<CheckCircle2 className="h-3.5 w-3.5" />
									{t('emailVerified')}
								</Badge>
							) : (
								<Badge
									variant="outline"
									className="gap-1 border-amber-500/30 bg-amber-500/10 text-xs font-bold text-amber-500"
								>
									<XCircle className="h-3.5 w-3.5" />
									{t('emailNotVerified')}
								</Badge>
							)}
						</div>
						<div className="flex justify-between pt-1">
							<span className="font-medium text-muted-foreground">{t('authProviderLabel')}</span>
							<span className="font-semibold text-foreground">
								{user.isOAuthGoogleProvider ? t('googleAuth') : t('standardAuth')}
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Metadata & Timestamps Card */}
				<Card className="rounded-2xl border-border/40 bg-card/60 shadow-md backdrop-blur-xl transition-all hover:border-sky-500/30 md:col-span-2 lg:col-span-1">
					<CardHeader className="flex flex-row items-center justify-between pb-3">
						<CardTitle className="text-base font-bold text-foreground">{t('createdAtLabel')}</CardTitle>
						<Calendar className="h-5 w-5 text-indigo-500" />
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<div className="flex items-center justify-between border-b border-border/30 pb-2.5">
							<span className="font-medium text-muted-foreground">{t('createdAtLabel')}</span>
							<div className="flex items-center gap-1.5 font-bold text-foreground">
								<Clock className="h-3.5 w-3.5 text-muted-foreground" />
								{formattedCreatedAt}
							</div>
						</div>
						<div className="flex items-center justify-between border-b border-border/30 pb-2.5">
							<span className="font-medium text-muted-foreground">{t('updatedAtLabel')}</span>
							<div className="flex items-center gap-1.5 font-bold text-foreground">
								<Clock className="h-3.5 w-3.5 text-muted-foreground" />
								{formattedUpdatedAt}
							</div>
						</div>
						<div className="flex items-center justify-between pt-1">
							<span className="font-medium text-muted-foreground">{t('sessionLabel')}</span>
							<Badge
								variant="outline"
								className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-500"
							>
								<span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
								{t('activeStatus')}
							</Badge>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
