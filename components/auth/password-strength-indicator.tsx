'use client';

import { useTranslations } from 'next-intl';
import { Progress } from '@/components/ui/progress';

type PasswordStrength = 'weak' | 'medium' | 'strong';

function computeStrength(password: string): PasswordStrength {
	if (password.length < 8) return 'weak';
	let score = 0;
	if (/[a-z]/.test(password)) score++;
	if (/[A-Z]/.test(password)) score++;
	if (/[0-9]/.test(password)) score++;
	if (/[^a-zA-Z0-9]/.test(password)) score++;
	if (score <= 2) return 'weak';
	if (score === 3) return 'medium';
	return 'strong';
}

const strengthConfig: Record<PasswordStrength, { percentage: number; colorClass: string }> = {
	weak: { percentage: 33, colorClass: '[&>div]:bg-destructive' },
	medium: { percentage: 66, colorClass: '[&>div]:bg-amber-500' },
	strong: { percentage: 100, colorClass: '[&>div]:bg-emerald-500' },
};

const strengthTextColor: Record<PasswordStrength, string> = {
	weak: 'text-destructive',
	medium: 'text-amber-500',
	strong: 'text-emerald-500',
};

interface PasswordStrengthIndicatorProps {
	password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
	const t = useTranslations('RegisterPage.passwordStrength');

	if (password.length === 0) return null;

	const strength = computeStrength(password);
	const { percentage, colorClass } = strengthConfig[strength];

	return (
		<div id="password-strength" aria-live="polite" className="space-y-1.5 pt-1">
			<Progress value={percentage} className={`h-1.5 bg-border/40 ${colorClass}`} />
			<p className="text-xs font-medium text-muted-foreground">
				{t('label')} : <span className={`font-bold ${strengthTextColor[strength]}`}>{t(strength)}</span>
			</p>
		</div>
	);
}
