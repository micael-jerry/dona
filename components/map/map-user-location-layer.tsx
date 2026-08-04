'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker, Circle as LeafletCircle } from 'leaflet';
import { useMapContext } from './map-provider';

const DEFAULT_FALLBACK_LOCATION = { lat: -18.8792, lng: 47.5079 }; // Antananarivo, Madagascar

interface MapUserLocationLayerProps {
	map: LeafletMap | null;
	/**
	 * Controls whether the small blue dot marker is rendered.
	 * Set to `false` to display only the global blue location circle.
	 * @default false
	 */
	showMarker?: boolean;
}

/**
 * MapUserLocationLayer
 *
 * Imperative layer rendering the user's location approximation circle on the map.
 * Guarantees the blue location circle is ALWAYS visible and auto-centers on mount.
 */
export function MapUserLocationLayer({ map, showMarker = false }: MapUserLocationLayerProps) {
	const { userLocation, userAccuracy } = useMapContext();

	const markerRef = useRef<LeafletMarker | null>(null);
	const accuracyCircleRef = useRef<LeafletCircle | null>(null);
	const hasCenteredOnInitialMount = useRef(false);

	// Auto-center map on real user GPS location when first obtained
	useEffect(() => {
		if (!map || !userLocation || hasCenteredOnInitialMount.current) return;

		hasCenteredOnInitialMount.current = true;
		map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.5 });
	}, [map, userLocation]);

	// Render / update user location layers (circle + optional marker)
	useEffect(() => {
		if (!map) return;

		// Use user GPS location if available, otherwise default to Madagascar center
		const activeLocation = userLocation ?? DEFAULT_FALLBACK_LOCATION;
		const radius = userAccuracy && userAccuracy > 0 ? userAccuracy : 250;

		import('leaflet').then((L) => {
			const latLng: [number, number] = [activeLocation.lat, activeLocation.lng];

			// ── 1. Global Blue Location Circle (ALWAYS RENDERED) ───────────────────
			if (accuracyCircleRef.current) {
				accuracyCircleRef.current.setLatLng(latLng);
				accuracyCircleRef.current.setRadius(radius);
			} else {
				const circle = L.circle(latLng, {
					radius,
					color: '#0284c7', // sky-600
					fillColor: '#38bdf8', // sky-400
					fillOpacity: 0.18,
					weight: 1.5,
				}).addTo(map);
				accuracyCircleRef.current = circle;
			}

			// ── 2. Small Blue Dot Marker (Controlled via showMarker prop) ───────────
			if (showMarker && userLocation) {
				if (markerRef.current) {
					markerRef.current.setLatLng(latLng);
				} else {
					const userIcon = L.divIcon({
						html: `
              <div class="relative flex items-center justify-center">
                <div class="absolute h-8 w-8 animate-ping rounded-full bg-sky-400/50"></div>
                <div class="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-sky-500 shadow-xl">
                  <div class="h-2 w-2 rounded-full bg-white"></div>
                </div>
              </div>
            `,
						className: 'user-location-marker-wrapper',
						iconSize: [32, 32],
						iconAnchor: [16, 16],
					});

					const marker = L.marker(latLng, {
						icon: userIcon,
						zIndexOffset: 1000,
					}).addTo(map);

					markerRef.current = marker;
				}
			} else if (markerRef.current) {
				// Remove marker if showMarker is false
				markerRef.current.remove();
				markerRef.current = null;
			}
		});
	}, [map, userLocation, userAccuracy, showMarker]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (markerRef.current) {
				markerRef.current.remove();
				markerRef.current = null;
			}
			if (accuracyCircleRef.current) {
				accuracyCircleRef.current.remove();
				accuracyCircleRef.current = null;
			}
		};
	}, []);

	return null;
}
