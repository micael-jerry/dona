import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
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
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<MapPin className="h-6 w-6 text-primary" />
					</div>
				</div>
				<CardTitle className="text-3xl font-bold tracking-tight">{t('title')}</CardTitle>
				<CardDescription className="font-medium text-muted-foreground">{t('description')}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				<LoginForm />
			</CardContent>

			<CardFooter className="flex justify-center border-t border-border/30 pt-6 pb-8">
				<p className="text-sm font-medium text-muted-foreground">
					{t('noAccount')}{' '}
					<Link href="/register" className="font-semibold text-primary hover:underline">
						{t('registerLink')}
					</Link>
				</p>
			</CardFooter>
		</AuthCard>
	);
}
