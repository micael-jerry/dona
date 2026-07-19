import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { AuthCard } from '@/components/auth/auth-card';
import { RegisterForm } from '@/components/auth/register-form';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
	const t = useTranslations('RegisterPage');

	return (
		<AuthCard variant="register">
			<CardHeader className="space-y-3 pb-6 text-center">
				<div className="mb-2 flex justify-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
						<MapPin className="h-6 w-6 text-accent" />
					</div>
				</div>
				<CardTitle className="text-3xl font-bold tracking-tight">{t('title')}</CardTitle>
				<CardDescription className="font-medium text-muted-foreground">{t('description')}</CardDescription>
			</CardHeader>

			<CardContent>
				<RegisterForm />
			</CardContent>

			<CardFooter className="flex justify-center border-t border-border/30 pt-6 pb-8">
				<p className="text-sm font-medium text-muted-foreground">
					{t('hasAccount')}{' '}
					<Link href="/login" className="font-semibold text-primary hover:underline">
						{t('loginLink')}
					</Link>
				</p>
			</CardFooter>
		</AuthCard>
	);
}
