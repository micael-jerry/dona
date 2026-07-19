'use client';

import { Globe } from 'lucide-react';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const LOCALES = [
	{ code: 'fr', label: 'Français', flag: '🇫🇷', href: '/' },
	{ code: 'en', label: 'English', flag: '🇬🇧', href: '/en' },
	{ code: 'es', label: 'Español', flag: '🇪🇸', href: '/es' },
];

export function LanguageSwitcher() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="h-9 gap-1.5 rounded-xl bg-transparent px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
						<Globe className="h-4 w-4" />
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="flex min-w-40 flex-col gap-0.5 p-1">
							{LOCALES.map(({ code, label, flag, href }) => (
								<li key={code}>
									{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
									<a
										href={href}
										className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
									>
										<span className="text-base leading-none">{flag}</span>
										<span>{label}</span>
										<span className="ml-auto text-xs font-semibold text-muted-foreground uppercase">{code}</span>
									</a>
								</li>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
