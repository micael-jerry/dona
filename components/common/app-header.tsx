import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { UserNav } from '@/components/common/user-nav';
import { MapPin } from 'lucide-react';

export function AppHeader() {
	const t = useTranslations('HomePage');

	return (
		<header className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-border/40 bg-background/70 px-4 backdrop-blur-xl transition-all duration-300 sm:px-6 lg:px-10">
			<div className="flex items-center gap-6">
				<Link className="group flex items-center gap-3" href="/">
					<div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-linear-to-br from-primary/20 via-sky-500/10 to-accent/20 p-2 shadow-md transition-transform duration-300 group-hover:scale-105">
						<Image src="/dona_app_logo.svg" fill className="object-contain p-1" alt="Dona Logo" />
					</div>
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<span className="bg-linear-to-r from-sky-400 via-cyan-400 to-indigo-400 bg-clip-text text-2xl font-black tracking-tight text-transparent">
								Dona
							</span>
							<span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
								<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
								LIVE
							</span>
						</div>
					</div>
				</Link>
			</div>

			<nav className="flex items-center gap-2 sm:gap-4">
				<LanguageSwitcher />
				<ThemeToggle />

				<div className="mx-1 hidden h-4 w-px bg-border/60 sm:block" />

				<UserNav />

				<Link href="/map">
					<Button className="rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 px-5 font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98]">
						<MapPin className="mr-1.5 h-4 w-4" />
						{t('playNow')}
					</Button>
				</Link>
			</nav>
		</header>
	);
}
