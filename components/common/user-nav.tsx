'use client';

import { useTranslations } from 'next-intl';
import { LogOut, LayoutDashboard, Loader2, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserNav() {
	const t = useTranslations('HomePage');
	const tAuth = useTranslations('Auth');
	const tDash = useTranslations('DashboardPage');
	const { user, isAuthenticated, isLoading, logout } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center px-4">
				<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isAuthenticated && user) {
		const avatarUrl = typeof user.avatar === 'string' ? user.avatar : undefined;
		const fallbackLetter = user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U';

		return (
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							className="relative h-10 gap-2.5 rounded-xl border border-sky-500/20 bg-sky-500/10 px-2.5 shadow-xs transition-all hover:border-sky-500/40 hover:bg-sky-500/20"
						>
							<Avatar className="h-7 w-7 rounded-lg border border-sky-500/30">
								<AvatarImage src={avatarUrl} alt={user.pseudo} />
								<AvatarFallback className="rounded-lg bg-sky-500 text-xs font-black text-white">
									{fallbackLetter}
								</AvatarFallback>
							</Avatar>
							<div className="hidden flex-col text-left sm:flex">
								<span className="text-xs leading-tight font-bold text-foreground">{user.pseudo}</span>
								<span className="max-w-30 truncate text-[10px] font-medium text-muted-foreground">{user.email}</span>
							</div>
						</Button>
					}
				/>

				<DropdownMenuContent
					className="w-56 rounded-2xl border-border/50 bg-card/95 shadow-xl backdrop-blur-xl"
					align="end"
				>
					<DropdownMenuGroup>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<div className="flex items-center justify-between">
									<p className="text-sm leading-none font-bold text-foreground">{user.pseudo}</p>
									<Badge
										variant="outline"
										className="border-sky-500/30 bg-sky-500/10 text-[10px] font-bold text-sky-400"
									>
										{user.role}
									</Badge>
								</div>
								<p className="truncate text-xs leading-none text-muted-foreground">{user.email}</p>
							</div>
						</DropdownMenuLabel>
					</DropdownMenuGroup>

					<DropdownMenuSeparator className="bg-border/40" />

					<DropdownMenuGroup>
						<DropdownMenuItem className="cursor-pointer rounded-xl font-medium focus:bg-sky-500/10 focus:text-sky-500">
							<Link href="/dashboard" className="flex w-full items-center gap-2">
								<LayoutDashboard className="h-4 w-4 text-sky-500" />
								<span>{tDash('title')}</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer rounded-xl font-medium focus:bg-sky-500/10 focus:text-sky-500">
							<Link href="/account" className="flex w-full items-center gap-2">
								<User className="h-4 w-4 text-sky-500" />
								<span>{tDash('accountButton')}</span>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator className="bg-border/40" />

					<DropdownMenuItem
						onClick={logout}
						className="cursor-pointer rounded-xl font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
					>
						<LogOut className="mr-2 h-4 w-4" />
						<span>{tAuth('logout')}</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
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
