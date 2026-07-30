'use client';

import { useMapContext } from './map-provider';
import { CATEGORY_COLORS } from '@/lib/map-marker-utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, Share2, Heart } from 'lucide-react';

export function EventDetailSheet() {
	const { selectedEvent, setSelectedEvent } = useMapContext();

	if (!selectedEvent) return null;

	const categoryConfig = CATEGORY_COLORS[selectedEvent.category] || CATEGORY_COLORS.community;

	return (
		<Sheet open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
			<SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
				{/* Event Header Image */}
				{selectedEvent.imageUrl ? (
					<div className="relative h-48 w-full bg-muted">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="h-full w-full object-cover" />
						<div className="absolute top-3 left-3">
							<Badge
								style={{ backgroundColor: categoryConfig.bg, color: categoryConfig.text }}
								className="font-bold shadow-md"
							>
								{categoryConfig.icon} {categoryConfig.label}
							</Badge>
						</div>
					</div>
				) : (
					<div className="h-24 w-full bg-gradient-to-r from-sky-500 to-indigo-600 p-4">
						<Badge
							style={{ backgroundColor: categoryConfig.bg, color: categoryConfig.text }}
							className="font-bold shadow-md"
						>
							{categoryConfig.icon} {categoryConfig.label}
						</Badge>
					</div>
				)}

				<div className="space-y-6 p-6">
					<SheetHeader className="space-y-2 p-0 text-left">
						<SheetTitle className="text-xl leading-tight font-bold">{selectedEvent.title}</SheetTitle>
						<SheetDescription className="text-sm text-muted-foreground">{selectedEvent.description}</SheetDescription>
					</SheetHeader>

					{/* Event Metadata (Date, Time, Address, Attendees) */}
					<div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs font-medium">
						<div className="flex items-center gap-2.5 text-foreground">
							<Calendar className="h-4 w-4 shrink-0 text-sky-500" />
							<span>{selectedEvent.date}</span>
						</div>
						<div className="flex items-center gap-2.5 text-foreground">
							<Clock className="h-4 w-4 shrink-0 text-sky-500" />
							<span>{selectedEvent.time}</span>
						</div>
						<div className="flex items-center gap-2.5 text-foreground">
							<MapPin className="h-4 w-4 shrink-0 text-rose-500" />
							<span className="truncate">{selectedEvent.addressName}</span>
						</div>
						<div className="flex items-center gap-2.5 text-foreground">
							<Users className="h-4 w-4 shrink-0 text-emerald-500" />
							<span>
								{selectedEvent.attendeesCount} participants{' '}
								{selectedEvent.maxAttendees ? `/ ${selectedEvent.maxAttendees} max` : ''}
							</span>
						</div>
					</div>

					{/* Organizer Profile */}
					<div className="flex items-center justify-between rounded-xl border border-border/40 p-3">
						<div className="flex items-center gap-3">
							<Avatar className="h-9 w-9 border">
								<AvatarImage src={selectedEvent.organizer.avatarUrl} alt={selectedEvent.organizer.name} />
								<AvatarFallback className="bg-sky-500 text-xs font-bold text-white">
									{selectedEvent.organizer.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="text-xs font-bold text-foreground">{selectedEvent.organizer.name}</p>
								<p className="text-[10px] text-muted-foreground">Organisateur</p>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center gap-2 pt-2">
						<Button className="flex-1 font-bold shadow-md">
							<Heart className="mr-2 h-4 w-4" />
							Participer
						</Button>
						<Button variant="outline" size="icon" className="shrink-0" title="Partager">
							<Share2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
