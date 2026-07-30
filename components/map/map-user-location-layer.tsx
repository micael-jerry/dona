'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker, Circle as LeafletCircle } from 'leaflet';
import { useMapContext } from './map-provider';

interface MapUserLocationLayerProps {
	map: LeafletMap | null;
}

/**
 * MapUserLocationLayer
 *
 * Imperative layer that renders a glowing real-time GPS marker for the user's position
 * and automatically centers the map on initial location load.
 */
export function MapUserLocationLayer({ map }: MapUserLocationLayerProps) {
	const { userLocation, userAccuracy } = useMapContext();

	const markerRef = useRef<LeafletMarker | null>(null);
	const accuracyCircleRef = useRef<LeafletCircle | null>(null);
	const hasCenteredOnInitialMount = useRef(false);

	// Auto-center map on initial GPS location load
	useEffect(() => {
		if (!map || !userLocation || hasCenteredOnInitialMount.current) return;

		hasCenteredOnInitialMount.current = true;
		map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.5 });
	}, [map, userLocation]);

	// Render / update user GPS marker and accuracy circle
	useEffect(() => {
		if (!map || !userLocation) {
			if (markerRef.current) {
				markerRef.current.remove();
				markerRef.current = null;
			}
			if (accuracyCircleRef.current) {
				accuracyCircleRef.current.remove();
				accuracyCircleRef.current = null;
			}
			return;
		}

		import('leaflet').then((L) => {
			const latLng: [number, number] = [userLocation.lat, userLocation.lng];

			// 1. Update or create GPS Marker (Glowing blue dot with pulse animation)
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

				const marker = L.marker(latLng, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
				markerRef.current = marker;
			}

			// 2. Update or create Accuracy circle
			if (userAccuracy && userAccuracy > 0) {
				if (accuracyCircleRef.current) {
					accuracyCircleRef.current.setLatLng(latLng);
					accuracyCircleRef.current.setRadius(userAccuracy);
				} else {
					const circle = L.circle(latLng, {
						radius: userAccuracy,
						color: '#0284c7',
						fillColor: '#38bdf8',
						fillOpacity: 0.15,
						weight: 1,
					}).addTo(map);
					accuracyCircleRef.current = circle;
				}
			}
		});
	}, [map, userLocation, userAccuracy]);

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
