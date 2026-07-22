'use client';

import { useTranslations } from 'next-intl';

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

const strengthConfig: Record<PasswordStrength, { segments: number; color: string }> = {
	weak: { segments: 1, color: 'bg-destructive' },
	medium: { segments: 2, color: 'bg-accent' },
	strong: { segments: 3, color: 'bg-green-500' },
};

const strengthTextColor: Record<PasswordStrength, string> = {
	weak: 'text-destructive',
	medium: 'text-accent',
	strong: 'text-green-500',
};

interface PasswordStrengthIndicatorProps {
	password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
	const t = useTranslations('RegisterPage.passwordStrength');

	if (password.length === 0) return null;

	const strength = computeStrength(password);
	const { segments, color } = strengthConfig[strength];

	return (
		<div id="password-strength" aria-live="polite" className="space-y-1.5">
			<div
				className="flex gap-1.5"
				role="meter"
				aria-valuemin={0}
				aria-valuemax={3}
				aria-valuenow={segments}
				aria-label={t('label')}
			>
				{[1, 2, 3].map((seg) => (
					<div
						key={seg}
						className={[
							'h-1.5 flex-1 rounded-full transition-all duration-300',
							seg <= segments ? color : 'bg-border',
						].join(' ')}
					/>
				))}
			</div>
			<p className="text-xs font-medium text-muted-foreground">
				{t('label')} : <span className={strengthTextColor[strength]}>{t(strength)}</span>
			</p>
		</div>
	);
}
