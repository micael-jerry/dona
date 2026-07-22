'use client';

import { useLocale } from 'next-intl';
import { Globe, Check } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/routing';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const LOCALES = [
	{ code: 'fr', label: 'Français', flag: '🇫🇷' },
	{ code: 'en', label: 'English', flag: '🇬🇧' },
	{ code: 'es', label: 'Español', flag: '🇪🇸' },
];

function setLocaleCookie(locale: string) {
	if (typeof document !== 'undefined') {
		document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
	}
}

export function LanguageSwitcher() {
	const currentLocale = useLocale();
	const pathname = usePathname();
	const router = useRouter();

	const handleLocaleChange = (newLocale: string) => {
		if (newLocale === currentLocale) return;
		setLocaleCookie(newLocale);
		router.replace(pathname, { locale: newLocale });
		router.refresh();
	};

	const currentObj = LOCALES.find((l) => l.code === currentLocale) || LOCALES[0];

	return (
		<NavigationMenu align="end">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="h-9 gap-1.5 rounded-xl bg-transparent px-3 text-xs font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
						<Globe className="h-4 w-4 text-sky-500" />
						<span className="uppercase">{currentObj.code}</span>
					</NavigationMenuTrigger>
					<NavigationMenuContent className="overflow-hidden rounded-2xl border border-border/60 bg-popover/95 p-1.5 shadow-2xl backdrop-blur-xl">
						<ul className="flex min-w-44 flex-col gap-1">
							{LOCALES.map(({ code, label, flag }) => {
								const isActive = code === currentLocale;
								return (
									<li key={code}>
										<button
											type="button"
											onClick={() => handleLocaleChange(code)}
											className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
												isActive
													? 'bg-primary/10 font-bold text-primary'
													: 'text-foreground hover:bg-muted/80 hover:text-sky-500'
											}`}
										>
											<span className="text-base leading-none">{flag}</span>
											<span className="flex-1 text-left">{label}</span>
											<span className="text-[10px] font-bold text-muted-foreground uppercase">{code}</span>
											{isActive && <Check className="ml-1 h-3.5 w-3.5 text-primary" />}
										</button>
									</li>
								);
							})}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
