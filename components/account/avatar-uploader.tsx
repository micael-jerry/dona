'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Camera, Upload, Check, AlertCircle, Loader2, Link2, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateAvatar, updateProfile, type UserResponse } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { extractErrorMessage } from '@/lib/errors';

interface AvatarUploaderProps {
	user: UserResponse;
}

export function AvatarUploader({ user }: AvatarUploaderProps) {
	const t = useTranslations('AccountPage.avatar');
	const tCommon = useTranslations('Auth');
	const { setUser } = useAuth();

	const [previewUrl, setPreviewUrl] = useState<string | null>(typeof user.avatar === 'string' ? user.avatar : null);
	const [urlInput, setUrlInput] = useState<string>(typeof user.avatar === 'string' ? user.avatar : '');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const fallbackLetter = user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U';

	// Handle local file selection
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		setErrorMsg(null);
		setSuccessMsg(null);
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			setErrorMsg(t('invalidFileType'));
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			setErrorMsg(t('fileTooLarge'));
			return;
		}

		setSelectedFile(file);
		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = reader.result as string;
			setPreviewUrl(dataUrl);
		};
		reader.readAsDataURL(file);
	};

	// Handle saving the avatar (upload file to S3 via updateAvatar or update URL via updateProfile)
	const handleSaveAvatar = async () => {
		setIsSubmitting(true);
		setErrorMsg(null);
		setSuccessMsg(null);

		try {
			if (selectedFile) {
				const res = await updateAvatar({
					body: {
						file: selectedFile,
					},
				});

				if (res.error || !res.data) {
					setErrorMsg(extractErrorMessage(res.error, tCommon('genericError')));
				} else {
					setUser(res.data);
					setSuccessMsg(t('successMessage'));
					setSelectedFile(null);
					if (typeof res.data.avatar === 'string') {
						setPreviewUrl(res.data.avatar);
						setUrlInput(res.data.avatar);
					}
				}
			} else {
				const finalAvatarUrl = urlInput.trim();
				if (!finalAvatarUrl) {
					setErrorMsg(t('emptyUrlError'));
					setIsSubmitting(false);
					return;
				}

				const res = await updateProfile({
					body: {
						avatar: finalAvatarUrl,
					},
				});

				if (res.error || !res.data) {
					setErrorMsg(extractErrorMessage(res.error, tCommon('genericError')));
				} else {
					setUser(res.data);
					setSuccessMsg(t('successMessage'));
				}
			}
		} catch (err: unknown) {
			setErrorMsg(extractErrorMessage(err, tCommon('genericError')));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Feedback Alerts */}
			{successMsg && (
				<Alert className="rounded-xl border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
					<Check className="h-4 w-4" />
					<AlertDescription className="font-medium">{successMsg}</AlertDescription>
				</Alert>
			)}

			{errorMsg && (
				<Alert variant="destructive" className="rounded-xl border-destructive/30 bg-destructive/10">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription className="font-medium">{errorMsg}</AlertDescription>
				</Alert>
			)}

			<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				{/* Avatar Display & Hover Overlay */}
				<div className="group relative flex flex-col items-center">
					<div className="relative h-28 w-28 overflow-hidden rounded-3xl border-2 border-sky-500/30 bg-sky-500/10 shadow-xl transition-all group-hover:border-sky-500/60">
						<Avatar className="h-full w-full rounded-3xl">
							<AvatarImage src={previewUrl || undefined} alt={user.pseudo} className="object-cover" />
							<AvatarFallback className="rounded-3xl bg-sky-500 text-3xl font-black text-white">
								{fallbackLetter}
							</AvatarFallback>
						</Avatar>

						{/* Overlay Button */}
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100"
							title={t('clickToUpload')}
						>
							<Camera className="mb-1 h-6 w-6" />
							<span className="text-[10px] font-bold uppercase">{t('change')}</span>
						</button>
					</div>

					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
						aria-label={t('uploadPhoto')}
					/>
				</div>

				{/* Upload Controls & URL Input */}
				<div className="w-full flex-1 space-y-4">
					<div>
						<h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
							<Upload className="h-4 w-4 text-sky-500" />
							{t('uploadTitle')}
						</h4>
						<p className="mt-0.5 text-xs text-muted-foreground">{t('uploadDescription')}</p>
					</div>

					{/* File Picker Button & Selected Status */}
					<div className="flex flex-wrap items-center gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => fileInputRef.current?.click()}
							className="h-10 rounded-xl border-sky-500/30 bg-sky-500/10 font-bold text-sky-400 hover:bg-sky-500/20"
						>
							<Upload className="mr-2 h-4 w-4" />
							{t('chooseFile')}
						</Button>

						{selectedFile && (
							<span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
								<Check className="h-3.5 w-3.5" />
								{selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
							</span>
						)}
					</div>

					{/* Direct URL Fallback */}
					<div className="space-y-2 pt-2">
						<Label
							htmlFor="avatar-url-input"
							className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
						>
							<Link2 className="h-3.5 w-3.5 text-sky-500" />
							{t('orDirectUrl')}
						</Label>
						<Input
							id="avatar-url-input"
							type="url"
							placeholder="https://example.com/my-avatar.png"
							value={urlInput}
							onChange={(e) => {
								setUrlInput(e.target.value);
								setPreviewUrl(e.target.value);
							}}
							className="h-10 rounded-xl border-border/50 bg-background/50 text-xs transition-all focus-visible:ring-primary/50"
						/>
					</div>

					{/* Save Button */}
					<div className="flex justify-end pt-2">
						<Button
							type="button"
							onClick={handleSaveAvatar}
							disabled={isSubmitting}
							className="h-10 rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 px-6 font-bold text-white shadow-md shadow-sky-500/20 hover:scale-[1.01]"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t('saving')}
								</>
							) : (
								<>
									<Sparkles className="mr-2 h-4 w-4" />
									{t('saveAvatar')}
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
