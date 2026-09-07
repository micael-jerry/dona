'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CATEGORY_COLORS } from '@/lib/map-marker-utils';
import { AlertTriangle, CheckCircle2, Clock, MapPin, Share2, ShieldCheck, XCircle } from 'lucide-react';
import { useMapContext } from './map-provider';

export function EventCreateSheet() {
	// const { selectedEvent, setSelectedEvent } = useMapContext();

	// if (!selectedEvent) return null;

	const { isCreatingEvent, /*setIsCreatingEvent,*/ setNewLocation } = useMapContext();

	// if (!isCreatingEvent) {
	// 	return null;
	// }

	// const categoryConfig = CATEGORY_COLORS[selectedEvent.category] || CATEGORY_COLORS.other;

	return (
		<Sheet
			open={!!isCreatingEvent}
			onOpenChange={(event, open) => {
				if (!open) {
					const target = (event as any)?.target as HTMLElement | undefined;
					console.log('target', target);
					const isCloseButton = target?.closest('[data-slot="sheet-close"]');
					if (!isCloseButton) return;
				}
				setNewLocation(null);
			}}
			modal={false}
		>
			<SheetContent
				side="right"
				className="pointer-events-auto w-full overflow-y-auto p-0 sm:max-w-md [*:has(>&):has([data-slot=sheet-overlay])_[data-slot=sheet-overlay]]:pointer-events-none [*:has(>&):has([data-slot=sheet-overlay])_[data-slot=sheet-overlay]]:hidden"
			>
				<div className="space-y-6 p-6">
					<SheetHeader className="space-y-2 p-0 text-left">
						<SheetTitle className="text-xl leading-tight font-bold">{/*selectedEvent.title*/}</SheetTitle>
						<SheetDescription className="text-sm text-muted-foreground">
							{/*selectedEvent.description*/}
						</SheetDescription>
					</SheetHeader>

					{/* Veracity & Community Credibility Score */}
					<div className="flex items-center justify-between rounded-xl border border-sky-500/30 bg-sky-500/10 p-3.5">
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-sky-500" />
							<div>
								<p className="text-xs font-bold text-sky-700 dark:text-sky-300">Indice de crédibilité</p>
								<p className="text-[11px] text-muted-foreground">
									{/*selectedEvent.confirmationsCount*/} confirmations communautaires
								</p>
							</div>
						</div>
						<span className="text-lg font-black text-sky-600 dark:text-sky-400">
							{/*selectedEvent.veracityScore*/}%
						</span>
					</div>

					{/* Signal Location & Time */}
					<div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs font-medium">
						<div className="flex items-center gap-2.5 text-foreground">
							<MapPin className="h-4 w-4 shrink-0 text-rose-500" />
							<span className="truncate">{/*selectedEvent.addressName*/}</span>
						</div>
						<div className="flex items-center gap-2.5 text-foreground">
							<Clock className="h-4 w-4 shrink-0 text-sky-500" />
							<span>Signalé {/*selectedEvent.createdAt*/}</span>
						</div>
					</div>

					{/* Waze-style Quick Reaction Buttons */}
				</div>
			</SheetContent>
		</Sheet>
	);
}
