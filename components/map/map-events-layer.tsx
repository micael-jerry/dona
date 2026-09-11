'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker, LayerGroup } from 'leaflet';
import L from 'leaflet';
import { useMapContext } from './map-provider';
import { createMarkerHtml } from '@/lib/map-marker-utils';

interface MapEventsLayerProps {
	map: LeafletMap | null;
}

/**
 * MapEventsLayer
 *
 * Imperative layer component that synchronization React state (`filteredEvents`,
 * `selectedEvent`, `newLocation`) with Leaflet `L.marker` objects.
 */
export function MapEventsLayer({ map }: MapEventsLayerProps) {
	const {
		filteredEvents,
		selectedEvent,
		hoveredEventId,
		setSelectedEvent,
		setHoveredEventId,
		isCreatingEvent,
		newLocation,
	} = useMapContext();

	const layerGroupRef = useRef<LayerGroup | null>(null);
	const creationMarkerRef = useRef<LeafletMarker | null>(null);

	// Initialise layer group on map ready
	useEffect(() => {
		if (!map) return;

		const group = L.layerGroup().addTo(map);
		layerGroupRef.current = group;

		return () => {
			group.clearLayers();
			group.remove();
			layerGroupRef.current = null;
		};
	}, [map]);

	// Render event markers whenever filteredEvents or selected/hovered state changes
	useEffect(() => {
		if (!map || !layerGroupRef.current) return;

		const group = layerGroupRef.current;
		group.clearLayers();

		filteredEvents.forEach((event) => {
			if (!event?.location?.lat || !event?.location?.lng) {
				return;
			}

			const isSelected = selectedEvent?.id === event.id;
			const isHovered = hoveredEventId === event.id;

			const html = createMarkerHtml(event.category, isSelected, isHovered);

			const icon = L.divIcon({
				html,
				className: 'custom-event-marker-wrapper',
				iconSize: [40, 40],
				iconAnchor: [20, 40],
			});

			const marker = L.marker([event.location.lat, event.location.lng], { icon });

			marker.on('click', (e) => {
				L.DomEvent.stopPropagation(e);
				setSelectedEvent(event);
			});

			marker.on('mouseover', () => {
				setHoveredEventId(event.id);
			});

			marker.on('mouseout', () => {
				setHoveredEventId(null);
			});

			marker.addTo(group);
		});
	}, [map, filteredEvents, selectedEvent, hoveredEventId, setSelectedEvent, setHoveredEventId]);

	// Render creation pin marker if user is selecting a location
	useEffect(() => {
		if (!map) return;

		if (!isCreatingEvent || !newLocation) {
			if (creationMarkerRef.current) {
				creationMarkerRef.current.remove();
				creationMarkerRef.current = null;
			}
			return;
		}

		if (creationMarkerRef.current) {
			creationMarkerRef.current.setLatLng([newLocation.lat, newLocation.lng]);
		} else {
			const icon = L.divIcon({
				html: `
          <div class="relative flex items-center justify-center">
            <div class="h-6 w-6 rounded-full bg-primary/40 animate-ping absolute"></div>
            <div class="h-8 w-8 rounded-full bg-primary border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
              📍
            </div>
          </div>
        `,
				className: 'creation-marker',
				iconSize: [32, 32],
				iconAnchor: [16, 16],
			});

			const marker = L.marker([newLocation.lat, newLocation.lng], { icon }).addTo(map);
			creationMarkerRef.current = marker;
		}
	}, [map, isCreatingEvent, newLocation]);

	return null;
}
