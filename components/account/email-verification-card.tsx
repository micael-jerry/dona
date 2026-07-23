'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, CheckCircle2, XCircle, Send, Loader2, Check, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { requestEmailVerification, type UserResponse } from '@/lib/api';
import { extractErrorMessage } from '@/lib/errors';

interface EmailVerificationCardProps {
	user: UserResponse;
}

export function EmailVerificationCard({ user }: EmailVerificationCardProps) {
	const t = useTranslations('AccountPage.emailVerification');
	const tCommon = useTranslations('Auth');

	const [isSending, setIsSending] = useState(false);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const handleResendVerification = async () => {
		setIsSending(true);
		setErrorMsg(null);
		setSuccessMsg(null);

		try {
			const res = await requestEmailVerification();

			if (res.error || !res.data) {
				setErrorMsg(extractErrorMessage(res.error, tCommon('genericError')));
			} else {
				setSuccessMsg(res.data.message || t('sentSuccessMessage'));
			}
		} catch (err: unknown) {
			setErrorMsg(extractErrorMessage(err, tCommon('genericError')));
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className="space-y-4 rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-xl">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10">
						<Mail className="h-5 w-5 text-sky-500" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<span className="text-sm font-bold text-foreground">{user.email}</span>
							{user.isEmailVerified ? (
								<Badge
									variant="outline"
									className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-500"
								>
									<CheckCircle2 className="h-3 w-3" />
									{t('verified')}
								</Badge>
							) : (
								<Badge
									variant="outline"
									className="gap-1 border-amber-500/30 bg-amber-500/10 text-[10px] font-bold text-amber-500"
								>
									<XCircle className="h-3 w-3" />
									{t('unverified')}
								</Badge>
							)}
						</div>
						<p className="mt-0.5 text-xs text-muted-foreground">
							{user.isEmailVerified ? t('verifiedDescription') : t('unverifiedDescription')}
						</p>
					</div>
				</div>

				{!user.isEmailVerified && (
					<Button
						type="button"
						variant="outline"
						onClick={handleResendVerification}
						disabled={isSending}
						className="h-10 rounded-xl border-sky-500/30 bg-sky-500/10 font-bold text-sky-400 hover:bg-sky-500/20"
					>
						{isSending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{t('sending')}
							</>
						) : (
							<>
								<Send className="mr-2 h-4 w-4" />
								{t('resendButton')}
							</>
						)}
					</Button>
				)}
			</div>

			{/* Feedback Alerts */}
			{successMsg && (
				<Alert className="rounded-xl border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
					<Check className="h-4 w-4" />
					<AlertDescription className="text-xs font-medium">{successMsg}</AlertDescription>
				</Alert>
			)}

			{errorMsg && (
				<Alert variant="destructive" className="rounded-xl border-destructive/30 bg-destructive/10">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription className="text-xs font-medium">{errorMsg}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
