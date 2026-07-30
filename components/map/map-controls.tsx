'use client';

import type { Map as LeafletMap } from 'leaflet';
import { useMapContext } from './map-provider';
import { CATEGORY_COLORS } from '@/lib/map-marker-utils';
import type { EventCategory } from '@/types/map';
import { Search, Navigation, Plus, Minus, MapPin, X } from 'lucide-react';
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

	const handleZoomIn = () => {
		map?.zoomIn();
	};

	const handleZoomOut = () => {
		map?.zoomOut();
	};

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
			<div className="pointer-events-none absolute top-4 right-16 left-4 z-[1001] flex flex-col gap-2.5 sm:max-w-md">
				{/* Search input + Create button */}
				<div className="pointer-events-auto flex items-center gap-2">
					<div className="relative flex-1">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Rechercher un événement, lieu..."
							value={filters.searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-10 border-border/50 bg-background/90 pr-8 pl-9 shadow-lg backdrop-blur-md focus-visible:ring-sky-500"
						/>
						{filters.searchQuery && (
							<button
								type="button"
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
						className="h-10 shrink-0 gap-1.5 rounded-xl px-3 font-semibold shadow-md transition-all"
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
				<div className="pointer-events-auto flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-1.5">
					{CATEGORY_ITEMS.map((item) => {
						const isActive = filters.category === item.key;
						return (
							<button
								key={item.key}
								type="button"
								onClick={() => setCategoryFilter(item.key)}
								className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all ${
									isActive
										? 'scale-105 border-primary bg-primary text-primary-foreground shadow-md'
										: 'border-border/70 bg-background/90 text-foreground hover:bg-background'
								}`}
							>
								<span>{item.icon}</span>
								<span>{item.label}</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* ── Bottom Right: Action Controls (Zoom In, Zoom Out, Recenter) ────────── */}
			<div className="pointer-events-auto absolute right-4 bottom-6 z-[1001] flex flex-col gap-1.5">
				<Button
					size="icon"
					variant="outline"
					onClick={handleZoomIn}
					className="h-9 w-9 rounded-xl border-border/60 bg-background/90 shadow-lg backdrop-blur-md hover:bg-background"
					title="Zoom avant"
				>
					<Plus className="h-4 w-4" />
				</Button>
				<Button
					size="icon"
					variant="outline"
					onClick={handleZoomOut}
					className="h-9 w-9 rounded-xl border-border/60 bg-background/90 shadow-lg backdrop-blur-md hover:bg-background"
					title="Zoom arrière"
				>
					<Minus className="h-4 w-4" />
				</Button>
				<Button
					size="icon"
					variant="outline"
					onClick={handleRecenterOnUser}
					className="h-9 w-9 rounded-xl border-border/60 bg-background/90 shadow-lg backdrop-blur-md hover:bg-background hover:text-sky-500"
					title="Centrer sur ma position GPS"
				>
					<Navigation className="h-4 w-4 text-sky-500" />
				</Button>
			</div>

			{/* ── Bottom Left: Status counter & Creation Banner ─────────────────────── */}
			<div className="pointer-events-auto absolute bottom-6 left-4 z-[1001] flex items-center gap-2">
				<Badge
					variant="outline"
					className="border-border/60 bg-background/90 px-3 py-1.5 text-xs font-bold text-foreground shadow-lg backdrop-blur-md"
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
