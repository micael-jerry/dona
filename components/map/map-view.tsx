'use client';

import type { GeoLocation } from '@/types/map';
import type { Map as LeafletMap } from 'leaflet';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { EventCreateSheet } from './event-create-sheet';
import { EventDetailSheet } from './event-detail-sheet';
import { EventUpdateSheet } from './event-update-sheet';
import { MapControls } from './map-controls';
import { MapEventsLayer } from './map-events-layer';
import { MapProvider, useMapContext } from './map-provider';
import { MapUserLocationLayer } from './map-user-location-layer';

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
	const { isCreatingEvent, isEditingEvent, setNewLocation, userLocation, newLocation } = useMapContext();

	const handleMapReady = useCallback((map: LeafletMap) => {
		setMapInstance(map);
	}, []);

	const handleMapClick = useCallback(
		(coords: GeoLocation) => {
			setNewLocation(isCreatingEvent ? coords : null);
		},
		[isCreatingEvent, setNewLocation],
	);

	return (
		<div className="absolute inset-0">
			{/* ── Core Leaflet Canvas ────────────────────────────────────────── */}
			<LeafletMapCore
				initialCenter={userLocation ?? undefined}
				onMapReady={handleMapReady}
				onMapClick={handleMapClick}
			/>

			{/* ── Overlay Layers & Controls (once canvas is ready) ───────────── */}
			{mapInstance && (
				<>
					<MapUserLocationLayer map={mapInstance} showMarker={false} />
					<MapEventsLayer map={mapInstance} />
					<MapControls map={mapInstance} />
					{isCreatingEvent && newLocation ? (
						<EventCreateSheet />
					) : isEditingEvent ? (
						<EventUpdateSheet />
					) : (
						<EventDetailSheet />
					)}
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
