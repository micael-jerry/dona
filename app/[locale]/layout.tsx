import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

const geistSans = Geist({
	variable: '--font-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Dona - Real-Time Road Event Signaling & Smart Routing',
	description:
		'Crowdsourced road event signaling, live veracity ratings, geolocated chat, and AI hazard-aware route navigation.',
};

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	params: Promise<{ locale: string }> | Promise<any>;
}) {
	const { locale } = (await params) as { locale: string };

	if (!(routing.locales as readonly string[]).includes(locale)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-grid-pattern bg-background text-foreground antialiased selection:bg-primary/20`}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<NextIntlClientProvider messages={messages}>
						<TooltipProvider>
							<AuthProvider>{children}</AuthProvider>
						</TooltipProvider>
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
