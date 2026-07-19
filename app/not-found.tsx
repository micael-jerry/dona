import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { Button } from '@/components/ui/button';
import { MapPinOff } from 'lucide-react';
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
	let messages: any;

	try {
		messages = (await import(`../messages/${locale}.json`)).default;
	} catch (error) {
		messages = (await import(`../messages/${routing.defaultLocale}.json`)).default;
	}

	return (
		<html lang={locale}>
			<body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}>
				<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
					{/* Background decorative blobs */}
					<div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />
					<div className="absolute right-1/4 bottom-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/20 blur-[100px]" />

					{/* Content Card */}
					<div className="relative z-10 mx-4 flex w-full max-w-lg flex-col items-center rounded-3xl border border-border bg-background/50 p-8 text-center shadow-2xl backdrop-blur-md">
						<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<MapPinOff className="h-8 w-8 text-primary" />
						</div>

						<h1 className="mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-8xl font-bold tracking-tighter text-transparent">
							404
						</h1>

						<h2 className="mb-2 text-2xl font-semibold text-foreground">{messages.NotFound?.title || 'Not Found'}</h2>

						<p className="mb-8 text-balance text-muted-foreground">
							{messages.NotFound?.description || 'Page not found.'}
						</p>

						<div className="flex gap-4">
							{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
							<a href="/">
								<Button
									size="lg"
									className="rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
								>
									{messages.NotFound?.backHome || 'Back'}
								</Button>
							</a>
						</div>
					</div>
				</main>
			</body>
		</html>
	);
}
