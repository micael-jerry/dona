'use client';

import { useUserLocation } from '@/hooks/use-user-location';
import { useEventStore } from '@/stores/event.store';
import type { DonaEvent, EventCategory, GeoLocation, MapFilterState } from '@/types/map';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type UpdateEventPayload = Partial<DonaEvent> & { id: string };

interface MapContextValue {
	allEvents: DonaEvent[];
	filteredEvents: DonaEvent[];
	selectedEvent: DonaEvent | null;
	hoveredEventId: string | null;
	filters: MapFilterState;
	userLocation: GeoLocation | null;
	userAccuracy?: number;
	isTrackingUser: boolean;
	locationError: string | null;
	isCreatingEvent: boolean;
	isEditingEvent: boolean;
	newLocation: GeoLocation | null;

	addEvent: (event: DonaEvent) => void;
	setSelectedEvent: (event: DonaEvent | null) => void;
	setHoveredEventId: (id: string | null) => void;
	setCategoryFilter: (category: EventCategory | 'all') => void;
	setSearchQuery: (query: string) => void;
	setIsCreatingEvent: (active: boolean) => void;
	setIsEditingEvent: (active: boolean) => void;
	setNewLocation: (location: GeoLocation | null) => void;
	updateEvent: (payload: UpdateEventPayload) => Promise<void>;
	requestUserLocation: () => void;
	resetFilters: () => void;
}

const MapContext = createContext<MapContextValue | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
	const allEvents = useEventStore((state) => state.events);

	const [selectedEvent, setSelectedEvent] = useState<DonaEvent | null>(null);
	const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
	const [isCreatingEvent, setIsCreatingEvent] = useState<boolean>(false);
	const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);
	const [newLocation, setNewLocation] = useState<GeoLocation | null>(null);

	const {
		coords: userLocation,
		accuracy: userAccuracy,
		isTracking: isTrackingUser,
		error: rawLocationError,
		requestLocation: requestUserLocation,
	} = useUserLocation();

	const locationError = rawLocationError ?? null;

	const [filters, setFilters] = useState<MapFilterState>({
		category: 'all',
		searchQuery: '',
	});

	const setCategoryFilter = useCallback((category: EventCategory | 'all') => {
		setFilters((prev) => ({ ...prev, category }));
	}, []);

	const setSearchQuery = useCallback((searchQuery: string) => {
		setFilters((prev) => ({ ...prev, searchQuery }));
	}, []);

	const resetFilters = useCallback(() => {
		setFilters({ category: 'all', searchQuery: '' });
	}, []);

	const addEvent = useCallback((event: DonaEvent) => {
		useEventStore.setState((state) => ({
			events: [event, ...state.events.filter((e) => e.id !== event.id)],
		}));
	}, []);

	const updateEvent = useCallback(async (payload: UpdateEventPayload) => {
		useEventStore.setState((state) => ({
			events: state.events.map((event) => (event.id === payload.id ? { ...event, ...payload } : event)),
		}));

		setSelectedEvent((prevSelected) =>
			prevSelected && prevSelected.id === payload.id ? { ...prevSelected, ...payload } : prevSelected,
		);
	}, []);

	const filteredEvents = useMemo(() => {
		if (!Array.isArray(allEvents)) return [];

		return allEvents.filter((event) => {
			if (!event) return false;

			const matchesCategory =
				filters.category === 'all' ||
				event.category === filters.category ||
				(typeof event.category === 'object' && (event.category as any)?.id === filters.category);

			const query = filters.searchQuery.trim().toLowerCase();
			const matchesSearch =
				!query ||
				(event.title && event.title.toLowerCase().includes(query)) ||
				(event.description && event.description.toLowerCase().includes(query)) ||
				(event.addressName && event.addressName.toLowerCase().includes(query));

			return matchesCategory && matchesSearch;
		});
	}, [allEvents, filters]);

	const value = useMemo(
		() => ({
			allEvents,
			filteredEvents,
			selectedEvent,
			hoveredEventId,
			filters,
			userLocation,
			userAccuracy,
			isTrackingUser,
			locationError,
			isCreatingEvent,
			isEditingEvent,
			newLocation,

			addEvent,
			setSelectedEvent,
			setHoveredEventId,
			setCategoryFilter,
			setSearchQuery,
			setIsCreatingEvent,
			setIsEditingEvent,
			setNewLocation,
			updateEvent,
			requestUserLocation,
			resetFilters,
		}),
		[
			allEvents,
			filteredEvents,
			selectedEvent,
			hoveredEventId,
			filters,
			userLocation,
			userAccuracy,
			isTrackingUser,
			locationError,
			isCreatingEvent,
			isEditingEvent,
			newLocation,
			addEvent,
			setCategoryFilter,
			setSearchQuery,
			updateEvent,
			requestUserLocation,
			resetFilters,
		],
	);

	return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMapContext(): MapContextValue {
	const context = useContext(MapContext);
	if (!context) {
		throw new Error('useMapContext must be used within a MapProvider.');
	}
	return context;
}
