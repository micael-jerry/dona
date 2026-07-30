'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { Loader2 } from 'lucide-react';
import { MapProvider, useMapContext } from './map-provider';
import { MapControls } from './map-controls';
import { MapEventsLayer } from './map-events-layer';
import { EventDetailSheet } from './event-detail-sheet';
import type { GeoLocation } from '@/types/map';

// ─── Dynamic import: Leaflet must never run on the server ─────────────────────
const LeafletMapCore = dynamic(() => import('./leaflet-map-core').then((m) => m.LeafletMapCore), {
	ssr: false,
	loading: () => (
		<div className="flex h-full w-full items-center justify-center bg-muted/20">
			<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	),
});

/**
 * Inner Map composition component accessing MapContext
 */
function MapViewContent() {
	const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
	const { isCreatingEvent, setNewLocation } = useMapContext();

	const handleMapReady = useCallback((map: LeafletMap) => {
		setMapInstance(map);
	}, []);

	const handleMapClick = useCallback(
		(coords: GeoLocation) => {
			if (isCreatingEvent) {
				setNewLocation(coords);
			}
		},
		[isCreatingEvent, setNewLocation],
	);

	return (
		<div className="absolute inset-0">
			{/* ── Core Leaflet Canvas ────────────────────────────────────────── */}
			<LeafletMapCore onMapReady={handleMapReady} onMapClick={handleMapClick} />

			{/* ── Overlay Layers & Controls (once canvas is ready) ───────────── */}
			{mapInstance && (
				<>
					<MapEventsLayer map={mapInstance} />
					<MapControls map={mapInstance} />
					<EventDetailSheet />
				</>
			)}
		</div>
	);
}

/**
 * MapView — Composition Root for the Map page.
 * Encloses the map ecosystem within MapProvider for clean dependency inversion and state sharing.
 */
export function MapView() {
	return (
		<MapProvider>
			<MapViewContent />
		</MapProvider>
	);
}
