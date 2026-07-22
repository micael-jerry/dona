import { useTranslations } from 'next-intl';
import { UserPlus } from 'lucide-react';
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
					<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 shadow-md">
						<UserPlus className="h-7 w-7 text-amber-500" />
					</div>
				</div>
				<CardTitle className="text-3xl font-black tracking-tight text-foreground">{t('title')}</CardTitle>
				<CardDescription className="text-sm font-medium text-muted-foreground">{t('description')}</CardDescription>
			</CardHeader>

			<CardContent>
				<RegisterForm />
			</CardContent>

			<CardFooter className="flex justify-center border-t border-border/30 pt-6 pb-4">
				<p className="text-sm font-medium text-muted-foreground">
					{t('hasAccount')}{' '}
					<Link
						href="/login"
						className="font-bold text-amber-500 transition-colors hover:text-amber-400 hover:underline"
					>
						{t('loginLink')}
					</Link>
				</p>
			</CardFooter>
		</AuthCard>
	);
}
