'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { Loader2 } from 'lucide-react';

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
 * MapView
 *
 * Full-viewport, theme-aware map page component.
 *
 * Responsibility: orchestrate the map canvas and any overlays / controls
 * that belong to the map page (HUD, search bar, layer toggles, etc.).
 * Map-specific business logic (markers, GeoJSON sources, event handlers)
 * should be added here — accessing the Leaflet instance via `mapRef.current`.
 *
 * Keep this file as the single composition root for the map page.
 */
export function MapView() {
	const mapRef = useRef<LeafletMap | null>(null);
	const [isReady, setIsReady] = useState(false);

	const handleMapReady = useCallback((map: LeafletMap) => {
		mapRef.current = map;
		setIsReady(true);
	}, []);

	return (
		<div className="absolute inset-0">
			{/* ── Map canvas ─────────────────────────────────────────────────── */}
			<LeafletMapCore onMapReady={handleMapReady} />

			{/* ── HUD overlay (rendered once map is ready) ───────────────────── */}
			{isReady && (
				<>
					{/* Attribution override is handled by Leaflet itself. */}
					{/* Add future overlays here: search bar, layer toggles, etc. */}
				</>
			)}
		</div>
	);
}
