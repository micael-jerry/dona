'use client';

import type { Map as LeafletMap } from 'leaflet';
import { useMapContext } from './map-provider';
import { CATEGORY_COLORS } from '@/lib/map-marker-utils';
import type { EventCategory } from '@/types/map';
import { Search, Navigation, Plus, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface MapControlsProps {
	map: LeafletMap | null;
}

const CATEGORY_ITEMS: { key: EventCategory | 'all'; label: string; icon: string }[] = [
	{ key: 'all', label: 'Tous', icon: '🌟' },
	{ key: 'food_drive', label: 'Alimentaire', icon: CATEGORY_COLORS.food_drive.icon },
	{ key: 'community', label: 'Communauté', icon: CATEGORY_COLORS.community.icon },
	{ key: 'environment', label: 'Écologie', icon: CATEGORY_COLORS.environment.icon },
	{ key: 'education', label: 'Éducation', icon: CATEGORY_COLORS.education.icon },
	{ key: 'charity', label: 'Caritatif', icon: CATEGORY_COLORS.charity.icon },
];

export function MapControls({ map }: MapControlsProps) {
	const {
		filteredEvents,
		allEvents,
		filters,
		userLocation,
		requestUserLocation,
		setCategoryFilter,
		setSearchQuery,
		isCreatingEvent,
		setIsCreatingEvent,
		newLocation,
		setNewLocation,
	} = useMapContext();

	const handleRecenterOnUser = () => {
		if (!map) return;

		if (userLocation) {
			map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.5 });
		} else {
			requestUserLocation();
		}
	};

	const handleToggleCreateMode = () => {
		if (isCreatingEvent) {
			setIsCreatingEvent(false);
			setNewLocation(null);
		} else {
			setIsCreatingEvent(true);
		}
	};

	return (
		<>
			{/* ── Top Bar: Search & Category Filters ────────────────────────────────── */}
			<div className="absolute top-4 right-16 left-4 z-20 flex flex-col gap-2.5 sm:max-w-xl">
				{/* Search input + Create button */}
				<div className="flex items-center gap-2">
					<div className="relative flex-1">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Rechercher un événement, lieu..."
							value={filters.searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-10 border-border/50 bg-background/80 pr-8 pl-9 shadow-md backdrop-blur-md focus-visible:ring-sky-500"
						/>
						{filters.searchQuery && (
							<button
								onClick={() => setSearchQuery('')}
								className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						)}
					</div>

					<Button
						size="sm"
						variant={isCreatingEvent ? 'destructive' : 'default'}
						onClick={handleToggleCreateMode}
						className="h-10 gap-1.5 rounded-xl px-3 font-semibold shadow-md transition-all"
					>
						{isCreatingEvent ? (
							<>
								<X className="h-4 w-4" />
								<span>Annuler</span>
							</>
						) : (
							<>
								<Plus className="h-4 w-4" />
								<span className="hidden sm:inline">Créer</span>
							</>
						)}
					</Button>
				</div>

				{/* Category pills */}
				<div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-1">
					{CATEGORY_ITEMS.map((item) => {
						const isActive = filters.category === item.key;
						return (
							<button
								key={item.key}
								onClick={() => setCategoryFilter(item.key)}
								className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md transition-all ${
									isActive
										? 'border-primary bg-primary text-primary-foreground shadow-sm'
										: 'border-border/60 bg-background/75 text-foreground hover:bg-background/90'
								}`}
							>
								<span>{item.icon}</span>
								<span>{item.label}</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* ── Bottom Right: Action Controls (Recenter on User Position) ───────────── */}
			<div className="absolute right-4 bottom-6 z-20 flex flex-col gap-2">
				<Button
					size="icon"
					variant="outline"
					onClick={handleRecenterOnUser}
					className="h-10 w-10 rounded-xl border-border/60 bg-background/85 shadow-lg backdrop-blur-md hover:bg-background hover:text-sky-500"
					title="Centrer sur ma position GPS"
				>
					<Navigation className="h-4 w-4 text-sky-500" />
				</Button>
			</div>

			{/* ── Bottom Left: Status counter & Creation Banner ─────────────────────── */}
			<div className="absolute bottom-6 left-4 z-20 flex items-center gap-2">
				<Badge
					variant="outline"
					className="border-border/60 bg-background/85 px-3 py-1.5 text-xs font-bold text-foreground shadow-lg backdrop-blur-md"
				>
					<span className="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
					{filteredEvents.length} / {allEvents.length} événements
				</Badge>

				{isCreatingEvent && (
					<Badge
						variant="default"
						className="animate-bounce border-sky-500 bg-sky-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md"
					>
						<MapPin className="mr-1.5 h-3.5 w-3.5" />
						{newLocation
							? `Position choisie (${newLocation.lat.toFixed(4)}, ${newLocation.lng.toFixed(4)})`
							: 'Cliquez sur la carte pour choisir le lieu'}
					</Badge>
				)}
			</div>
		</>
	);
}
