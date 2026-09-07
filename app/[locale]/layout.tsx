import '@/app/globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';

import { UserSettingsInitializer } from '@/components/settings/user-settings-initializer';

const geistSans = Geist({
	variable: '--font-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
});

const inter = Inter({
	variable: '--font-custom-sans',
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
		<html lang={locale} className={`${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
			<body
				suppressHydrationWarning
				className={`bg-grid-pattern bg-background font-sans text-foreground antialiased selection:bg-primary/20`}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<NextIntlClientProvider messages={messages}>
						<TooltipProvider>
							<AuthProvider>
								<UserSettingsInitializer>{children}</UserSettingsInitializer>
							</AuthProvider>
						</TooltipProvider>
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
