'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/hooks/use-auth';
import { NAV_GROUPS } from '@/config/nav';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, Sparkles } from 'lucide-react';

export function DashboardSidebar() {
	const t = useTranslations('Navigation');
	const tAuth = useTranslations('Auth');
	const pathname = usePathname();
	const { user, logout } = useAuth();

	if (!user) return null;

	const avatarUrl = typeof user.avatar === 'string' ? user.avatar : undefined;
	const fallbackLetter = user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U';

	return (
		<Sidebar collapsible="icon" side="left" variant="sidebar">
			{/* ── Logo / Brand ────────────────────────────────────────────── */}
			<SidebarHeader className="border-b border-border/40 p-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" tooltip="Dona" render={<Link href="/" className="flex items-center gap-3" />}>
							<div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-linear-to-br from-primary/20 via-sky-500/10 to-accent/20 p-1 shadow-md">
								<Image src="/dona_app_logo.svg" fill className="object-contain p-0.5" alt="Dona Logo" />
							</div>
							<div className="flex flex-col overflow-hidden">
								<span className="bg-linear-to-r from-sky-400 via-cyan-400 to-indigo-400 bg-clip-text text-base leading-none font-black tracking-tight text-transparent">
									Dona
								</span>
								<span className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-emerald-500">
									<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
									LIVE
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* ── Nav Groups (driven by config/nav.ts) ────────────────────── */}
			<SidebarContent className="py-2">
				{NAV_GROUPS.map((group) => {
					// Filter items by role if `roles` is specified
					const visibleItems = group.items.filter((item) => !item.roles || item.roles.includes(user.role));
					if (visibleItems.length === 0) return null;

					return (
						<SidebarGroup key={group.labelKey}>
							<SidebarGroupLabel className="px-3 text-[11px] font-bold tracking-wider text-muted-foreground/60 uppercase">
								{t(group.labelKey as Parameters<typeof t>[0])}
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{visibleItems.map(({ labelKey, href, icon: Icon }) => {
										const isActive = pathname.includes(href);
										return (
											<SidebarMenuItem key={href}>
												<SidebarMenuButton
													isActive={isActive}
													tooltip={t(labelKey as Parameters<typeof t>[0])}
													className="rounded-xl font-medium transition-all"
													render={<Link href={href} />}
												>
													<Icon className="h-4 w-4 shrink-0" />
													<span>{t(labelKey as Parameters<typeof t>[0])}</span>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					);
				})}
			</SidebarContent>

			<SidebarSeparator className="bg-border/40" />

			{/* ── User footer ─────────────────────────────────────────────── */}
			<SidebarFooter className="p-3">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							onClick={logout}
							tooltip={tAuth('logout')}
							className="rounded-xl font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
						>
							<LogOut className="h-4 w-4 shrink-0" />
							<span>{tAuth('logout')}</span>
						</SidebarMenuButton>
					</SidebarMenuItem>

					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							tooltip={user.pseudo ?? user.email}
							className="rounded-xl hover:bg-sky-500/10"
							render={<Link href="/account" />}
						>
							<Avatar className="h-7 w-7 shrink-0 rounded-lg border border-sky-500/30">
								<AvatarImage src={avatarUrl} alt={user.pseudo} />
								<AvatarFallback className="rounded-lg bg-sky-500 text-xs font-black text-white">
									{fallbackLetter}
								</AvatarFallback>
							</Avatar>
							<div className="flex min-w-0 flex-col">
								<div className="flex items-center gap-1.5">
									<span className="truncate text-xs leading-none font-bold text-foreground">
										{user.pseudo ?? user.name}
									</span>
									<Badge
										variant="outline"
										className="shrink-0 border-sky-500/30 bg-sky-500/10 px-1 py-0 text-[9px] font-bold text-sky-400"
									>
										<Sparkles className="mr-0.5 h-2 w-2" />
										{user.role}
									</Badge>
								</div>
								<span className="mt-0.5 truncate text-[10px] text-muted-foreground">{user.email}</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
