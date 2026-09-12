'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CATEGORY_COLORS } from '@/lib/map-marker-utils';
import { useEventStore } from '@/stores/event.store';
import { useAuthStore } from '@/stores/use-auth-store';
import {
	AlertTriangle,
	CheckCircle2,
	Clock,
	Loader2,
	MapPin,
	Pencil,
	Share2,
	ShieldCheck,
	XCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useMapContext } from './map-provider';

export function EventDetailSheet() {
	const t = useTranslations('EventDetailSheet');
	const { selectedEvent, setSelectedEvent, isEditingEvent, setIsEditingEvent } = useMapContext();
	const { confirmEvent } = useEventStore();
	const { token } = useAuthStore();
	const [isConfirming, setIsConfirming] = useState(false);
	const [reportedTimestamp, setReportedTimestamp] = useState({ time: 'juste_maintenant', value: 0 });

	useEffect(() => {
		if (!selectedEvent?.createdAt) return;
		const reportedAt = new Date(selectedEvent.createdAt);
		const secondes = Math.floor((Date.now() - reportedAt.getTime()) / 1000);

		if (secondes < 60) {
			setReportedTimestamp({ time: 'juste_maintenant', value: 0 });
		} else if (secondes < 3600) {
			const mins = Math.floor(secondes / 60);
			setReportedTimestamp({ time: mins === 1 ? 'minute' : 'minutes', value: mins });
		} else if (secondes < 86400) {
			const hours = Math.floor(secondes / 3600);
			setReportedTimestamp({ time: hours === 1 ? 'hour' : 'hours', value: hours });
		} else {
			const days = Math.floor(secondes / 86400);
			setReportedTimestamp({ time: days === 1 ? 'day' : 'days', value: days });
		}
		console.log(reportedTimestamp);
	}, [selectedEvent?.createdAt]);

	if (!selectedEvent || isEditingEvent) return null;

	const categoryConfig = CATEGORY_COLORS[selectedEvent.category] || CATEGORY_COLORS.other;

	const isOwner = selectedEvent.reportedBy.isOwner;
	const hasConfirmed = selectedEvent.hasUserConfirmed;
	const isConfirmDisabled = isOwner || hasConfirmed || isConfirming;

	const handleOpenEdit = () => {
		setIsEditingEvent(true);
	};

	const handleConfirmPresence = async () => {
		if (isConfirmDisabled || !token) return;

		try {
			setIsConfirming(true);
			await confirmEvent(selectedEvent.id, token);
		} catch (error) {
			console.error('Erreur lors de la confirmation :', error);
		} finally {
			setIsConfirming(false);
		}
	};

	return (
		<Sheet open={!!selectedEvent && !isEditingEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
			<SheetContent hideOverlay={true} side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
				{/* Road Event Header Image or Banner */}
				{selectedEvent.imageUrl ? (
					<div className="relative h-48 w-full bg-muted">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="h-full w-full object-cover" />
						<div className="absolute top-3 left-3 flex gap-2">
							<Badge
								style={{
									backgroundColor: categoryConfig.bg,
									color: categoryConfig.text,
								}}
								className="font-bold shadow-md"
							>
								{categoryConfig.icon} {categoryConfig.label}
							</Badge>

							{selectedEvent.isOfficialValidated && (
								<Badge
									variant="secondary"
									className="flex items-center gap-1 bg-emerald-500/90 font-bold text-white shadow-md"
								>
									<ShieldCheck className="h-3.5 w-3.5" />
									Vérifié
								</Badge>
							)}
						</div>
					</div>
				) : (
					<div className="flex h-24 w-full items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white">
						<Badge
							style={{
								backgroundColor: categoryConfig.bg,
								color: categoryConfig.text,
							}}
							className="font-bold shadow-md"
						>
							{categoryConfig.icon} {categoryConfig.label}
						</Badge>

						{selectedEvent.isOfficialValidated && (
							<Badge
								variant="secondary"
								className="flex items-center gap-1 bg-emerald-500 font-bold text-white shadow-md"
							>
								<ShieldCheck className="h-3.5 w-3.5" />
								Vérifié
							</Badge>
						)}
					</div>
				)}

				<div className="space-y-6 p-6">
					<SheetHeader className="space-y-2 p-0 text-left">
						<div className="flex items-start justify-between gap-3">
							<SheetTitle className="text-xl leading-tight font-bold">{selectedEvent.title}</SheetTitle>
							{selectedEvent.reportedBy.isOwner && (
								<Button
									variant="outline"
									size="icon"
									onClick={handleOpenEdit}
									className="h-8 w-8 shrink-0 rounded-lg border-border/80"
									title="Modifier le signalement"
								>
									<Pencil className="h-4 w-4 text-muted-foreground" />
								</Button>
							)}
						</div>
						<SheetDescription className="text-sm text-muted-foreground">{selectedEvent.description}</SheetDescription>
					</SheetHeader>

					{/* Veracity & Community Credibility Score */}
					<div className="flex items-center justify-between rounded-xl border border-sky-500/30 bg-sky-500/10 p-3.5">
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-sky-500" />
							<div>
								<p className="text-xs font-bold text-sky-700 dark:text-sky-300">Indice de crédibilité</p>
								<p className="text-[11px] text-muted-foreground">
									{selectedEvent.confirmationsCount} confirmations communautaires
								</p>
							</div>
						</div>
						<span className="text-lg font-black text-sky-600 dark:text-sky-400">
							{selectedEvent.veracityScore?.toFixed(2)}%
						</span>
					</div>

					{/* Signal Location & Time */}
					<div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs font-medium">
						<div className="flex items-center gap-2.5 text-foreground">
							<MapPin className="h-4 w-4 shrink-0 text-rose-500" />
							<span className="truncate">{selectedEvent.addressName}</span>
						</div>
						<div className="flex items-center gap-2.5 text-foreground">
							<Clock className="h-4 w-4 shrink-0 text-sky-500" />
							<span>{t('reported', { time: reportedTimestamp.time, value: reportedTimestamp.value })}</span>
						</div>
					</div>

					{/* Reporter Profile */}
					<div className="flex items-center justify-between rounded-xl border border-border/40 p-3">
						<div className="flex items-center gap-3">
							<Avatar className="h-9 w-9 border">
								<AvatarImage src={selectedEvent.reportedBy.avatarUrl} alt={selectedEvent.reportedBy.name} />
								<AvatarFallback className="bg-sky-500 text-xs font-bold text-white">
									{selectedEvent.reportedBy.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="text-xs font-bold text-foreground">{selectedEvent.reportedBy.name}</p>
								<p className="text-[10px] text-muted-foreground">
									Score de réputation: {selectedEvent.reportedBy.reputationScore ?? 100} pts
								</p>
							</div>
						</div>
					</div>

					{/* Waze-style Quick Reaction Buttons */}
					<div className="space-y-2 pt-2">
						<p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
							{t('eventPresenceQuest')}
						</p>
						<div className="flex items-center gap-2">
							<Button
								disabled={isConfirmDisabled}
								onClick={handleConfirmPresence}
								className={`flex-1 font-bold shadow-md transition-all ${
									hasConfirmed
										? 'bg-emerald-700 text-white hover:bg-emerald-700'
										: 'bg-emerald-600 text-white hover:bg-emerald-700'
								}`}
							>
								{isConfirming ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<CheckCircle2 className="mr-2 h-4 w-4" />
								)}
								{hasConfirmed ? 'Déjà confirmé' : t('stillThereButton')} ({selectedEvent.confirmationsCount})
							</Button>

							<Button
								variant="outline"
								className="flex-1 border-rose-500/40 font-bold text-rose-600 hover:bg-rose-500/10"
							>
								<XCircle className="mr-2 h-4 w-4" />
								{t('resolvingButton')} ({selectedEvent.resolutionsCount})
							</Button>
							<Button variant="outline" size="icon" className="shrink-0" title="Partager">
								<Share2 className="h-4 w-4" />
							</Button>
						</div>
						{isOwner && (
							<p className="pt-1 text-[11px] text-muted-foreground italic">Vous êtes l'auteur de ce signalement.</p>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
