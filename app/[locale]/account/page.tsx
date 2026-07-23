'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Camera, KeyRound, ShieldAlert, LayoutDashboard, Sparkles, ArrowLeft } from 'lucide-react';
import { ProfileForm } from '@/components/account/profile-form';
import { AvatarUploader } from '@/components/account/avatar-uploader';
import { PasswordForm } from '@/components/account/password-form';
import { EmailVerificationCard } from '@/components/account/email-verification-card';
import { DeleteAccountDialog } from '@/components/account/delete-account-dialog';

export default function AccountPage() {
	const t = useTranslations('AccountPage');
	const { user } = useAuth();

	if (!user) return null;

	const avatarUrl = typeof user.avatar === 'string' ? user.avatar : undefined;
	const fallbackLetter = user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U';

	return (
		<div className="mx-auto max-w-5xl space-y-8 py-4">
			{/* Page Header & Navigation */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-4">
					<Link href="/dashboard">
						<Button
							variant="ghost"
							size="icon"
							className="h-10 w-10 rounded-xl border border-border/50 bg-background/50 hover:bg-muted"
						>
							<ArrowLeft className="h-5 w-5 text-foreground" />
						</Button>
					</Link>
					<div className="space-y-0.5">
						<h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
							{t('title')}
						</h1>
						<p className="text-xs font-medium text-muted-foreground">{t('description')}</p>
					</div>
				</div>

				<Link href="/dashboard">
					<Button
						variant="outline"
						className="h-10 rounded-xl border-sky-500/30 bg-sky-500/10 font-bold text-sky-400 hover:bg-sky-500/20"
					>
						<LayoutDashboard className="mr-2 h-4 w-4" />
						{t('dashboardButton')}
					</Button>
				</Link>
			</div>

			{/* User Overview Summary Header */}
			<div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-linear-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 p-6 shadow-xl backdrop-blur-xl sm:p-8">
				<div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
				<div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-5">
						<Avatar className="h-20 w-20 rounded-2xl border-2 border-sky-500/30 shadow-md">
							<AvatarImage src={avatarUrl} alt={user.pseudo} />
							<AvatarFallback className="rounded-2xl bg-sky-500 text-3xl font-black text-white">
								{fallbackLetter}
							</AvatarFallback>
						</Avatar>

						<div className="space-y-1">
							<div className="flex flex-wrap items-center gap-2">
								<h2 className="text-2xl font-black tracking-tight text-foreground">{user.pseudo}</h2>
								<Badge
									variant="outline"
									className="gap-1 rounded-full border-sky-500/30 bg-sky-500/15 text-xs font-bold text-sky-400"
								>
									<Sparkles className="h-3 w-3" />
									{user.role}
								</Badge>
							</div>
							<p className="text-sm font-medium text-muted-foreground">{user.name || user.email}</p>
							<p className="font-mono text-xs text-muted-foreground/80">{user.email}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs Management System */}
			<Tabs defaultValue="profile" className="w-full space-y-6">
				<TabsList className="flex h-12 w-full justify-start overflow-x-auto rounded-2xl border border-border/40 bg-card/60 p-1 backdrop-blur-xl sm:w-fit">
					<TabsTrigger
						value="profile"
						className="rounded-xl px-4 text-xs font-bold data-active:bg-sky-500/20 data-active:text-sky-400"
					>
						<User className="mr-2 h-4 w-4" />
						{t('tabs.profile')}
					</TabsTrigger>
					<TabsTrigger
						value="avatar"
						className="rounded-xl px-4 text-xs font-bold data-active:bg-sky-500/20 data-active:text-sky-400"
					>
						<Camera className="mr-2 h-4 w-4" />
						{t('tabs.avatar')}
					</TabsTrigger>
					<TabsTrigger
						value="password"
						className="rounded-xl px-4 text-xs font-bold data-active:bg-sky-500/20 data-active:text-sky-400"
					>
						<KeyRound className="mr-2 h-4 w-4" />
						{t('tabs.security')}
					</TabsTrigger>
					<TabsTrigger
						value="danger"
						className="rounded-xl px-4 text-xs font-bold data-active:bg-destructive/20 data-active:text-destructive"
					>
						<ShieldAlert className="mr-2 h-4 w-4" />
						{t('tabs.danger')}
					</TabsTrigger>
				</TabsList>

				{/* Tab 1: Profile & Email Verification */}
				<TabsContent value="profile" className="space-y-6">
					<Card className="rounded-3xl border-border/40 bg-card/60 shadow-xl backdrop-blur-xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
								<User className="h-5 w-5 text-sky-500" />
								{t('profileCardTitle')}
							</CardTitle>
							<CardDescription className="text-xs text-muted-foreground">{t('profileCardDescription')}</CardDescription>
						</CardHeader>
						<CardContent>
							<ProfileForm user={user} />
						</CardContent>
					</Card>

					<EmailVerificationCard user={user} />
				</TabsContent>

				{/* Tab 2: Avatar Upload */}
				<TabsContent value="avatar">
					<Card className="rounded-3xl border-border/40 bg-card/60 shadow-xl backdrop-blur-xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
								<Camera className="h-5 w-5 text-sky-500" />
								{t('avatarCardTitle')}
							</CardTitle>
							<CardDescription className="text-xs text-muted-foreground">{t('avatarCardDescription')}</CardDescription>
						</CardHeader>
						<CardContent>
							<AvatarUploader user={user} />
						</CardContent>
					</Card>
				</TabsContent>

				{/* Tab 3: Security & Password */}
				<TabsContent value="password">
					<Card className="rounded-3xl border-border/40 bg-card/60 shadow-xl backdrop-blur-xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
								<KeyRound className="h-5 w-5 text-sky-500" />
								{t('passwordCardTitle')}
							</CardTitle>
							<CardDescription className="text-xs text-muted-foreground">
								{t('passwordCardDescription')}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<PasswordForm user={user} />
						</CardContent>
					</Card>
				</TabsContent>

				{/* Tab 4: Danger Zone */}
				<TabsContent value="danger">
					<DeleteAccountDialog user={user} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
