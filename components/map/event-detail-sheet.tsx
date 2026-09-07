'use client';

import { useMapContext } from './map-provider';
import { CATEGORY_COLORS } from '@/lib/map-marker-utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, MapPin, CheckCircle2, XCircle, ShieldCheck, Share2, AlertTriangle } from 'lucide-react';

export function EventDetailSheet() {
	const { selectedEvent, setSelectedEvent } = useMapContext();

	if (!selectedEvent) return null;

	const categoryConfig = CATEGORY_COLORS[selectedEvent.category] || CATEGORY_COLORS.other;

	return (
		<Sheet open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
			<SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
				{/* Road Event Header Image or Banner */}
				{selectedEvent.imageUrl ? (
					<div className="relative h-48 w-full bg-muted">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="h-full w-full object-cover" />
						<div className="absolute top-3 left-3 flex gap-2">
							<Badge
								style={{ backgroundColor: categoryConfig.bg, color: categoryConfig.text }}
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
							style={{ backgroundColor: categoryConfig.bg, color: categoryConfig.text }}
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
						<SheetTitle className="text-xl leading-tight font-bold">{selectedEvent.title}</SheetTitle>
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
						<span className="text-lg font-black text-sky-600 dark:text-sky-400">{selectedEvent.veracityScore}%</span>
					</div>

					{/* Signal Location & Time */}
					<div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs font-medium">
						<div className="flex items-center gap-2.5 text-foreground">
							<MapPin className="h-4 w-4 shrink-0 text-rose-500" />
							<span className="truncate">{selectedEvent.addressName}</span>
						</div>
						<div className="flex items-center gap-2.5 text-foreground">
							<Clock className="h-4 w-4 shrink-0 text-sky-500" />
							<span>Signalé {selectedEvent.createdAt}</span>
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
							Le signalement est-il toujours là ?
						</p>
						<div className="flex items-center gap-2">
							<Button className="flex-1 bg-emerald-600 font-bold text-white shadow-md hover:bg-emerald-700">
								<CheckCircle2 className="mr-2 h-4 w-4" />
								Encore là ({selectedEvent.confirmationsCount})
							</Button>
							<Button
								variant="outline"
								className="flex-1 border-rose-500/40 font-bold text-rose-600 hover:bg-rose-500/10"
							>
								<XCircle className="mr-2 h-4 w-4" />
								Résolu ({selectedEvent.resolutionsCount})
							</Button>
							<Button variant="outline" size="icon" className="shrink-0" title="Partager">
								<Share2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
