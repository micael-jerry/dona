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
	labels: {
		// Esri World Boundaries and Places overlay for street & place name labels over satellite imagery
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
		maxZoom: 18,
	},
} as const;

// Default center: Antananarivo, Madagascar (fallback when user location is unavailable)
const DEFAULT_CENTER: [number, number] = [-18.8792, 47.5079];
const DEFAULT_ZOOM = 13;

export interface LeafletMapCoreProps {
	/** Initial coordinates to center the map on mount */
	initialCenter?: GeoLocation;
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
 * Configured with street view and hybrid satellite view (satellite imagery + transparent place/street name labels overlay).
 */
export function LeafletMapCore({ initialCenter, onMapReady, onMapClick, onBoundsChange }: LeafletMapCoreProps) {
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

			// 1. Standard Street Layer (OpenStreetMap)
			const streetLayer = L.tileLayer(TILE_LAYERS.street.url, {
				attribution: TILE_LAYERS.street.attribution,
				maxZoom: TILE_LAYERS.street.maxZoom,
			});

			// 2. Hybrid Satellite Layer (Esri Satellite + World Boundaries/Places Labels Overlay)
			const satelliteBase = L.tileLayer(TILE_LAYERS.satellite.url, {
				attribution: TILE_LAYERS.satellite.attribution,
				maxZoom: TILE_LAYERS.satellite.maxZoom,
			});

			const labelsOverlay = L.tileLayer(TILE_LAYERS.labels.url, {
				maxZoom: TILE_LAYERS.labels.maxZoom,
				pane: 'shadowPane', // Renders transparent street & place labels overlay
			});

			const hybridSatelliteLayer = L.layerGroup([satelliteBase, labelsOverlay]);

			// Determine center coordinates and zoom
			const centerCoords: [number, number] = initialCenter ? [initialCenter.lat, initialCenter.lng] : DEFAULT_CENTER;
			const initialZoom = initialCenter ? 15 : DEFAULT_ZOOM;

			// Initialize map with street as default base layer
			const map = L.map(containerRef.current, {
				center: centerCoords,
				zoom: initialZoom,
				zoomControl: false,
				attributionControl: true,
				layers: [streetLayer],
			});

			// Layer selector control (top-right)
			L.control
				.layers(
					{
						'🗺️ Street': streetLayer,
						'🛰️ Satellite': hybridSatelliteLayer,
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
