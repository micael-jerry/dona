import { useTranslations } from 'next-intl';
import { AppHeader } from '@/components/common/app-header';
import { HeroSection } from '@/components/home/hero-section';

export default function HomePage() {
	const t = useTranslations('HomePage');

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<AppHeader />
			<main className="mt-20 flex-1">
				<HeroSection t={t} />
			</main>
		</div>
	);
}
