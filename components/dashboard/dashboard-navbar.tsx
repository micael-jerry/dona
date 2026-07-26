'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { UserNav } from '@/components/common/user-nav';

export function DashboardNavbar() {
	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl">
			{/* Sidebar toggle */}
			<SidebarTrigger className="-ml-1 rounded-xl text-muted-foreground hover:text-foreground" />
			<Separator orientation="vertical" className="mx-2 h-4 bg-border/60" />

			{/* Spacer */}
			<div className="flex-1" />

			{/* Right side: lang + account */}
			<div className="flex items-center gap-2">
				<LanguageSwitcher />
				<Separator orientation="vertical" className="mx-1 h-4 bg-border/60" />
				<UserNav />
			</div>
		</header>
	);
}
