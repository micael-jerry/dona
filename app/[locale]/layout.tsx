import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
	variable: '--font-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Dona - ft_transcendence',
	description: 'The ultimate ft_transcendence project.',
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;

	if (!(routing.locales as readonly string[]).includes(locale)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
			</body>
		</html>
	);
}
