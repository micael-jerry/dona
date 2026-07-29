'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { Map as LeafletMap, TileLayer as LeafletTileLayer } from 'leaflet';

// ─── Tile layer (always light — map has no dark mode) ────────────────────────
const TILE_LAYER = {
	url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};

// ─── Default center: Paris ────────────────────────────────────────────────────
const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];
const DEFAULT_ZOOM = 13;

interface LeafletMapCoreProps {
	/** Called with the Leaflet Map instance once it is ready. Use this to add markers, layers, etc. */
	onMapReady?: (map: LeafletMap) => void;
}

/**
 * LeafletMapCore
 *
 * Leaflet map rendered into a div via imperative API.
 * Loaded exclusively on the client side (see map-view.tsx for the dynamic wrapper).
 * Always uses the light (OpenStreetMap) tile layer regardless of the app theme.
 *
 * Design decisions:
 *  - Pure imperative Leaflet (no react-leaflet JSX) for full lifecycle control.
 *  - `onMapReady` callback exposes the raw `L.Map` so callers can attach any Leaflet
 *    primitive (markers, GeoJSON layers, WMS layers, custom controls, etc.).
 */
export function LeafletMapCore({ onMapReady }: LeafletMapCoreProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<LeafletMap | null>(null);
	const tileRef = useRef<LeafletTileLayer | null>(null);

	// ── initialise once ────────────────────────────────────────────────────────
	useEffect(() => {
		if (mapRef.current || !containerRef.current) return;

		// Dynamic import keeps Leaflet 100 % client-side.
		import('leaflet').then((L) => {
			if (!containerRef.current || mapRef.current) return;

			// Fix Leaflet's broken default icon paths when bundled by Next.js / webpack.
			// Must be done before any icon is used.
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
				iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
				shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
			});

			const map = L.map(containerRef.current, {
				center: DEFAULT_CENTER,
				zoom: DEFAULT_ZOOM,
				zoomControl: true,
				attributionControl: true,
			});

			const tile = L.tileLayer(TILE_LAYER.url, {
				attribution: TILE_LAYER.attribution,
				maxZoom: 19,
			});
			tile.addTo(map);

			mapRef.current = map;
			tileRef.current = tile;

			onMapReady?.(map);
		});

		return () => {
			mapRef.current?.remove();
			mapRef.current = null;
			tileRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ── invalidate map size on container resize (sidebar toggle, window resize…) ─
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		// ResizeObserver fires every time the container's bounding box changes,
		// including during the 200 ms sidebar CSS transition.
		// We call invalidateSize() so Leaflet recalculates its canvas dimensions.
		const ro = new ResizeObserver(() => {
			mapRef.current?.invalidateSize({ animate: false });
		});

		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	return <div ref={containerRef} className="h-full w-full" />;
}

/**
 * useLeafletMap
 *
 * Hook used by child components (markers, layers) to access the map instance
 * once it is mounted. Pass the callback you receive from onMapReady.
 *
 * Usage:
 *   const { mapRef, handleMapReady } = useLeafletMap();
 *   <LeafletMapCore onMapReady={handleMapReady} />
 */
export function useLeafletMap() {
	const mapRef = useRef<LeafletMap | null>(null);

	const handleMapReady = useCallback((map: LeafletMap) => {
		mapRef.current = map;
	}, []);

	return { mapRef, handleMapReady };
}
