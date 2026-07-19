import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/language-switcher';

export function AppHeader() {
	const t = useTranslations('HomePage');

	return (
		<header className="fixed top-0 z-50 flex h-20 w-full items-center border-b border-border/40 bg-background/60 px-4 backdrop-blur-md transition-all duration-300 lg:px-8">
			<Link className="group flex items-center justify-center" href="/">
				<div className="relative h-10 w-10 overflow-hidden transition-transform duration-300 group-hover:scale-110">
					<Image src="/dona_app_logo.svg" fill alt="Dona Logo" />
				</div>
				<span className="ml-3 bg-linear-to-r from-primary to-accent bg-clip-text text-2xl font-extrabold text-transparent">
					Dona
				</span>
			</Link>

			<nav className="ml-auto flex items-center gap-4 sm:gap-6">
				<LanguageSwitcher />

				<Link href="/login" className="hidden sm:flex">
					<Button variant="ghost" className="w-full font-semibold">
						{t('login')}
					</Button>
				</Link>
				<Link href="/map">
					<Button className="w-full font-semibold shadow-lg transition-all hover:shadow-primary/25">
						{t('playNow')}
					</Button>
				</Link>
			</nav>
		</header>
	);
}
