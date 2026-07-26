'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Settings, Globe, Moon, Sun, Laptop, Check } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/routing';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { setLocaleCookie, syncSettingsToDb } from '@/lib/settings-helpers';
import { cn } from '@/lib/utils';

const LOCALES = [
	{ code: 'fr', label: 'Français', flag: '🇫🇷' },
	{ code: 'en', label: 'English', flag: '🇬🇧' },
	{ code: 'es', label: 'Español', flag: '🇪🇸' },
];

interface SettingsDialogProps {
	children?: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
	const t = useTranslations('Settings');
	const currentLocale = useLocale();
	const pathname = usePathname();
	const router = useRouter();
	const { theme, setTheme } = useTheme();

	const [open, setOpen] = useState(false);

	const handleLocaleChange = (newLocale: string) => {
		if (newLocale === currentLocale) return;
		setLocaleCookie(newLocale);
		syncSettingsToDb({ locale: newLocale });
		router.replace(pathname, { locale: newLocale });
		router.refresh();
	};

	const handleThemeChange = (newTheme: string) => {
		if (newTheme === theme) return;
		setTheme(newTheme);
		syncSettingsToDb({ theme: newTheme });
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{children ? (
				<DialogTrigger render={children as React.ReactElement} />
			) : (
				<DialogTrigger
					render={
						<button
							type="button"
							className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
						>
							<Settings className="h-4 w-4 text-sky-500" />
							<span>{t('title')}</span>
						</button>
					}
				/>
			)}

			<DialogContent className="rounded-3xl border-border/50 bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:max-w-md">
				<DialogHeader className="space-y-1.5 text-left">
					<DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
						<Settings className="h-5 w-5 text-sky-500" />
						{t('title')}
					</DialogTitle>
					<DialogDescription className="text-xs text-muted-foreground">{t('description')}</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 pt-2">
					{/* Language Section */}
					<div className="space-y-3">
						<label className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
							<Globe className="h-4 w-4 text-sky-500" />
							{t('languageSection')}
						</label>
						<div className="grid grid-cols-3 gap-2">
							{LOCALES.map(({ code, label, flag }) => {
								const isActive = code === currentLocale;
								return (
									<button
										key={code}
										type="button"
										onClick={() => handleLocaleChange(code)}
										className={cn(
											'relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition-all',
											isActive
												? 'border-sky-500/50 bg-sky-500/10 text-sky-500 shadow-md ring-2 shadow-sky-500/10 ring-sky-500/30'
												: 'border-border/40 bg-background/50 text-muted-foreground hover:border-sky-500/30 hover:bg-muted/50 hover:text-foreground',
										)}
									>
										<span className="text-xl">{flag}</span>
										<span>{label}</span>
										{isActive && <Check className="absolute top-2 right-2 h-3.5 w-3.5 text-sky-500" />}
									</button>
								);
							})}
						</div>
					</div>

					{/* Theme Section */}
					<div className="space-y-3">
						<label className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
							<Sun className="h-4 w-4 text-amber-500" />
							{t('themeSection')}
						</label>
						<div className="grid grid-cols-3 gap-2">
							{[
								{ key: 'light', label: t('themeLight'), icon: Sun, color: 'text-amber-500' },
								{ key: 'dark', label: t('themeDark'), icon: Moon, color: 'text-indigo-400' },
								{ key: 'system', label: t('themeSystem'), icon: Laptop, color: 'text-sky-400' },
							].map(({ key, label, icon: Icon, color }) => {
								const isActive = theme === key;
								return (
									<button
										key={key}
										type="button"
										onClick={() => handleThemeChange(key)}
										className={cn(
											'relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition-all',
											isActive
												? 'border-sky-500/50 bg-sky-500/10 text-sky-500 shadow-md ring-2 shadow-sky-500/10 ring-sky-500/30'
												: 'border-border/40 bg-background/50 text-muted-foreground hover:border-sky-500/30 hover:bg-muted/50 hover:text-foreground',
										)}
									>
										<Icon className={cn('h-5 w-5', color)} />
										<span>{label}</span>
										{isActive && <Check className="absolute top-2 right-2 h-3.5 w-3.5 text-sky-500" />}
									</button>
								);
							})}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
