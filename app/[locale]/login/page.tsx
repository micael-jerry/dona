import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
	const t = useTranslations('LoginPage');

	return (
		<AuthCard variant="login">
			<CardHeader className="space-y-3 pb-6 text-center">
				<div className="mb-2 flex justify-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 shadow-md">
						<MapPin className="h-7 w-7 text-sky-500" />
					</div>
				</div>
				<CardTitle className="text-3xl font-black tracking-tight text-foreground">{t('title')}</CardTitle>
				<CardDescription className="text-sm font-medium text-muted-foreground">{t('description')}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				<Suspense
					fallback={
						<div className="flex h-64 items-center justify-center">
							<Loader2 className="h-6 w-6 animate-spin text-sky-500" />
						</div>
					}
				>
					<LoginForm />
				</Suspense>
			</CardContent>

			<CardFooter className="flex justify-center border-t border-border/30 pt-6 pb-4">
				<p className="text-sm font-medium text-muted-foreground">
					{t('noAccount')}{' '}
					<Link
						href="/register"
						className="font-bold text-sky-500 transition-colors hover:text-sky-400 hover:underline"
					>
						{t('registerLink')}
					</Link>
				</p>
			</CardFooter>
		</AuthCard>
	);
}
