import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HomePage() {
	const t = useTranslations('HomePage');

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<header className="fixed top-0 z-50 flex h-20 w-full items-center border-b border-border/40 bg-background/60 px-4 backdrop-blur-md transition-all duration-300 lg:px-8">
				<Link className="group flex items-center justify-center" href="/">
					<div className="relative h-10 w-10 overflow-hidden transition-transform duration-300 group-hover:scale-110">
						<Image src="/dona_app_logo.svg" fill alt="Dona Logo" />
					</div>
					<span className="ml-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-extrabold text-transparent">
						Dona
					</span>
				</Link>
				<nav className="ml-auto flex items-center gap-4 sm:gap-6">
					<div className="mr-4 hidden gap-4 sm:flex">
						<a className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary" href="/en">
							EN
						</a>
						<a className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary" href="/">
							FR
						</a>
						<a className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary" href="/es">
							ES
						</a>
					</div>
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

			<main className="mt-20 flex-1">
				<section className="relative flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden">
					{/* Decorative background glassmorphism / gradients */}
					<div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-50 blur-[120px]" />
					<div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-accent/20 opacity-50 blur-[100px]" />

					<div className="relative z-10 container flex flex-col items-center px-4 text-center md:px-6">
						<div className="mb-6 inline-block animate-in rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary duration-700 fade-in slide-in-from-bottom-4">
							🚀 ft_transcendence
						</div>

						<h1 className="mx-auto mb-6 max-w-4xl animate-in text-5xl font-black tracking-tight text-foreground delay-150 duration-700 fade-in slide-in-from-bottom-6 sm:text-6xl md:text-7xl lg:text-8xl">
							{t('title')}
						</h1>

						<p className="mx-auto mb-10 max-w-[700px] animate-in text-lg text-muted-foreground delay-300 duration-700 fade-in slide-in-from-bottom-8 md:text-xl lg:text-2xl">
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
			</main>
		</div>
	);
}
