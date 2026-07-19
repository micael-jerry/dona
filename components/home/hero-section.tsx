import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

type TranslationFn = ReturnType<typeof useTranslations<'HomePage'>>;

interface HeroSectionProps {
	t: TranslationFn;
}

export function HeroSection({ t }: HeroSectionProps) {
	return (
		<section className="relative flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden">
			{/* Decorative background */}
			<div className="pointer-events-none absolute top-1/2 left-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-50 blur-[120px]" />
			<div className="pointer-events-none absolute top-0 right-0 h-125 w-125 rounded-full bg-accent/20 opacity-50 blur-[100px]" />

			<div className="relative z-10 container flex flex-col items-center px-4 text-center md:px-6">
				<div className="mb-6 inline-block animate-in rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary duration-700 fade-in slide-in-from-bottom-4">
					🚀 ft_transcendence
				</div>

				<h1 className="mx-auto mb-6 max-w-4xl animate-in text-5xl font-black tracking-tight text-foreground delay-150 duration-700 fade-in slide-in-from-bottom-6 sm:text-6xl md:text-7xl lg:text-8xl">
					{t('title')}
				</h1>

				<p className="mx-auto mb-10 max-w-175 animate-in text-lg text-muted-foreground delay-300 duration-700 fade-in slide-in-from-bottom-8 md:text-xl lg:text-2xl">
					{t('description')}
				</p>

				<div className="mx-auto flex w-full max-w-md animate-in flex-col justify-center gap-4 delay-500 duration-700 slide-in-from-bottom-10 fade-in sm:flex-row sm:gap-6">
					<Link href="/map" className="w-full sm:w-auto">
						<Button
							size="lg"
							className="h-14 w-full px-8 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-primary/40"
						>
							{t('playNow')}
						</Button>
					</Link>
					<Link href="/login" className="w-full sm:w-auto">
						<Button
							size="lg"
							variant="outline"
							className="h-14 w-full border-2 px-8 text-lg font-bold transition-all hover:bg-muted"
						>
							{t('login')}
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
