'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, LeafletMouseEvent } from 'leaflet';
import type { GeoLocation, MapBounds } from '@/types/map';

// ─── Base Tile Layers Config ──────────────────────────────────────────────────
const TILE_LAYERS = {
	street: {
		url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 19,
	},
	satellite: {
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		attribution:
			'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
		maxZoom: 18,
	},
} as const;

const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];
const DEFAULT_ZOOM = 13;

export interface LeafletMapCoreProps {
	/** Callback when Leaflet map instance is created and ready */
	onMapReady?: (map: LeafletMap) => void;
	/** Callback when the user clicks on an empty space on the map */
	onMapClick?: (coords: GeoLocation) => void;
	/** Callback when map view bounds change (pan/zoom) */
	onBoundsChange?: (bounds: MapBounds) => void;
}

/**
 * LeafletMapCore
 *
 * Core imperative Leaflet map container component.
 * Responsible ONLY for initializing the canvas, setting tile layers, handling window/container
 * resize, and dispatching raw map events (click, moveend).
 */
export function LeafletMapCore({ onMapReady, onMapClick, onBoundsChange }: LeafletMapCoreProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<LeafletMap | null>(null);

	// Keep event handlers refs up to date without triggering re-initialization
	const onMapClickRef = useRef(onMapClick);
	const onBoundsChangeRef = useRef(onBoundsChange);

	useEffect(() => {
		onMapClickRef.current = onMapClick;
	}, [onMapClick]);

	useEffect(() => {
		onBoundsChangeRef.current = onBoundsChange;
	}, [onBoundsChange]);

	// ── Initialise Leaflet Map ─────────────────────────────────────────────────
	useEffect(() => {
		if (mapRef.current || !containerRef.current) return;

		import('leaflet').then((L) => {
			if (!containerRef.current || mapRef.current) return;

			// Fix Leaflet's default icon assets
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
				iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
				shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
			});

			// Build base tile layers
			const streetLayer = L.tileLayer(TILE_LAYERS.street.url, {
				attribution: TILE_LAYERS.street.attribution,
				maxZoom: TILE_LAYERS.street.maxZoom,
			});

			const satelliteLayer = L.tileLayer(TILE_LAYERS.satellite.url, {
				attribution: TILE_LAYERS.satellite.attribution,
				maxZoom: TILE_LAYERS.satellite.maxZoom,
			});

			// Initialize map
			const map = L.map(containerRef.current, {
				center: DEFAULT_CENTER,
				zoom: DEFAULT_ZOOM,
				zoomControl: false,
				attributionControl: true,
				layers: [streetLayer],
			});

			// Layer selector control (top-right)
			L.control
				.layers(
					{
						'🗺️ Street': streetLayer,
						'🛰️ Satellite': satelliteLayer,
					},
					{},
					{ position: 'topright', collapsed: false },
				)
				.addTo(map);

			// Attach map click listener
			map.on('click', (e: LeafletMouseEvent) => {
				if (onMapClickRef.current) {
					onMapClickRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
				}
			});

			// Attach moveend listener (bounds change)
			map.on('moveend', () => {
				if (onBoundsChangeRef.current) {
					const b = map.getBounds();
					onBoundsChangeRef.current({
						northEast: { lat: b.getNorthEast().lat, lng: b.getNorthEast().lng },
						southWest: { lat: b.getSouthWest().lat, lng: b.getSouthWest().lng },
					});
				}
			});

			mapRef.current = map;
			onMapReady?.(map);
		});

		return () => {
			mapRef.current?.remove();
			mapRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ── ResizeObserver for smooth responsive recalculations ───────────────────
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const ro = new ResizeObserver(() => {
			mapRef.current?.invalidateSize({ animate: false });
		});

		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	return <div ref={containerRef} className="h-full w-full" />;
}
