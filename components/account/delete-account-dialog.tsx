'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, AlertTriangle, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { deleteAccount, type UserResponse } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from '@/i18n/routing';
import { extractErrorMessage } from '@/lib/errors';

interface DeleteAccountDialogProps {
	user: UserResponse;
}

export function DeleteAccountDialog({ user }: DeleteAccountDialogProps) {
	const t = useTranslations('AccountPage.dangerZone');
	const tCommon = useTranslations('Auth');
	const { logout } = useAuth();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [password, setPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const handleDelete = async () => {
		setIsSubmitting(true);
		setErrorMsg(null);

		try {
			const res = await deleteAccount({
				body: {
					password: password || undefined,
				},
			});

			if (res.error) {
				setErrorMsg(extractErrorMessage(res.error, tCommon('genericError')));
			} else {
				setOpen(false);
				logout();
				router.push('/');
			}
		} catch (err: unknown) {
			setErrorMsg(extractErrorMessage(err, tCommon('genericError')));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 backdrop-blur-xl">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-1">
					<h4 className="flex items-center gap-2 text-base font-bold text-destructive">
						<AlertTriangle className="h-5 w-5" />
						{t('title')}
					</h4>
					<p className="max-w-lg text-xs leading-relaxed text-muted-foreground">{t('warningDescription')}</p>
				</div>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button
							variant="destructive"
							className="h-10 rounded-xl bg-destructive font-bold text-white shadow-md shadow-destructive/20 hover:bg-destructive/90"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							{t('deleteButton')}
						</Button>
					</DialogTrigger>

					<DialogContent className="rounded-3xl border-destructive/30 bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:max-w-md">
						<DialogHeader className="space-y-3 text-left">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
								<Trash2 className="h-6 w-6" />
							</div>
							<DialogTitle className="text-xl font-black text-foreground">{t('dialogTitle')}</DialogTitle>
							<DialogDescription className="text-xs leading-relaxed text-muted-foreground">
								{t('dialogDescription')}
							</DialogDescription>
						</DialogHeader>

						{errorMsg && (
							<Alert variant="destructive" className="rounded-xl border-destructive/30 bg-destructive/10">
								<AlertDescription className="text-xs font-medium">{errorMsg}</AlertDescription>
							</Alert>
						)}

						{!user.isOAuthGoogleProvider && (
							<div className="space-y-2 py-2">
								<Label
									htmlFor="delete-confirm-password"
									className="flex items-center gap-1.5 text-xs font-bold text-foreground"
								>
									<Lock className="h-3.5 w-3.5 text-destructive" />
									{t('confirmPasswordLabel')}
								</Label>
								<Input
									id="delete-confirm-password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="h-11 rounded-xl border-border/50 bg-background/50 text-sm"
								/>
							</div>
						)}

						<DialogFooter className="gap-2 pt-3 sm:gap-0">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								className="h-11 rounded-xl font-semibold"
							>
								{t('cancel')}
							</Button>
							<Button
								type="button"
								variant="destructive"
								onClick={handleDelete}
								disabled={isSubmitting || (!user.isOAuthGoogleProvider && !password)}
								className="h-11 rounded-xl bg-destructive font-bold text-white hover:bg-destructive/90"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{t('deleting')}
									</>
								) : (
									<>
										<Trash2 className="mr-2 h-4 w-4" />
										{t('confirmDelete')}
									</>
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
