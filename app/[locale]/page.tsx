import { AppHeader } from '@/components/common/app-header';
import { HeroSection } from '@/components/home/hero-section';

export default function HomePage() {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<AppHeader />
			<main className="mt-20 flex-1">
				<HeroSection />
			</main>
		</div>
	);
}
