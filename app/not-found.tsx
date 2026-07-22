import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { Button } from '@/components/ui/button';
import { MapPinOff, ArrowLeft } from 'lucide-react';
import { cookies } from 'next/headers';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
	variable: '--font-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
});

export default async function NotFound() {
	const cookieStore = await cookies();
	const locale = cookieStore.get('NEXT_LOCALE')?.value || routing.defaultLocale;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let messages: any;

	try {
		messages = (await import(`../messages/${locale}.json`)).default;
	} catch {
		messages = (await import(`../messages/${routing.defaultLocale}.json`)).default;
	}

	return (
		<html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-grid-pattern min-h-screen bg-background font-sans antialiased selection:bg-primary/20`}
			>
				<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
					{/* Background decorative ambient lighting */}
					<div className="pointer-events-none absolute top-1/3 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-tr from-sky-500/20 via-cyan-400/10 to-indigo-600/15 blur-[140px]" />

					{/* Glass Card Container */}
					<div className="relative z-10 flex w-full max-w-md flex-col items-center rounded-3xl border border-border/60 bg-card/80 p-8 text-center shadow-2xl backdrop-blur-2xl transition-all">
						<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 shadow-md">
							<MapPinOff className="h-8 w-8 text-sky-500" />
						</div>

						<span className="mb-2 bg-linear-to-r from-sky-400 via-cyan-400 to-indigo-500 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl">
							404
						</span>

						<h1 className="mb-2 text-2xl font-bold text-foreground">{messages.NotFound?.title || 'Off Route'}</h1>

						<p className="mb-8 text-sm leading-relaxed text-muted-foreground">
							{messages.NotFound?.description ||
								"It looks like you've gone off route. The page you are looking for doesn't exist."}
						</p>

						<div className="w-full">
							{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
							<a href="/" className="block w-full">
								<Button
									size="lg"
									className="h-12 w-full rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98]"
								>
									<ArrowLeft className="mr-2 h-4 w-4" />
									{messages.NotFound?.backHome || 'Back to Home'}
								</Button>
							</a>
						</div>
					</div>
				</main>
			</body>
		</html>
	);
}
