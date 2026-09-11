'use client';

import { useUserLocation } from '@/hooks/use-user-location';
import type { DonaEvent, EventCategory, GeoLocation, MapFilterState } from '@/types/map';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type UpdateEventPayload = Partial<DonaEvent> & { id: string };

interface MapContextValue {
	// State
	allEvents: DonaEvent[];
	filteredEvents: DonaEvent[];
	selectedEvent: DonaEvent | null;
	createEvent: any | null;
	hoveredEventId: string | null;
	filters: MapFilterState;
	userLocation: GeoLocation | null;
	userAccuracy?: number;
	isTrackingUser: boolean;
	locationError: string | null;
	isCreatingEvent: boolean;
	isEditingEvent: boolean;
	newLocation: GeoLocation | null;

	// Actions
	setAllEvents: (events: DonaEvent[]) => void;
	setSelectedEvent: (event: DonaEvent | null) => void;
	setCreateEvent: (event: any | null) => void;
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
	const [allEvents, setAllEvents] = useState<DonaEvent[]>([]);
	const [selectedEvent, setSelectedEvent] = useState<DonaEvent | null>(null);
	const [createEvent, setCreateEvent] = useState<any | null>(null);
	const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
	const [isCreatingEvent, setIsCreatingEvent] = useState<boolean>(false);
	const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);
	const [newLocation, setNewLocation] = useState<GeoLocation | null>(null);

	// Real-time geolocation tracking hook
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

	const updateEvent = useCallback(async (payload: UpdateEventPayload) => {
		setAllEvents((prevEvents) =>
			prevEvents.map((event) => (event.id === payload.id ? { ...event, ...payload } : event)),
		);

		setSelectedEvent((prevSelected) =>
			prevSelected && prevSelected.id === payload.id ? { ...prevSelected, ...payload } : prevSelected,
		);

		// TODO: Add API request like await api.updateEvent(payload) here... if necessary
	}, []);

	// Filter events based on active category and search query
	const filteredEvents = useMemo(() => {
		return allEvents.filter((event) => {
			const matchesCategory = filters.category === 'all' || event.category === filters.category;
			const query = filters.searchQuery.trim().toLowerCase();
			const matchesSearch =
				!query ||
				event.title.toLowerCase().includes(query) ||
				event.description.toLowerCase().includes(query) ||
				event.addressName.toLowerCase().includes(query);

			return matchesCategory && matchesSearch;
		});
	}, [allEvents, filters]);

	const value = useMemo(
		() => ({
			allEvents,
			filteredEvents,
			selectedEvent,
			createEvent,
			hoveredEventId,
			filters,
			userLocation,
			userAccuracy,
			isTrackingUser,
			locationError,
			isCreatingEvent,
			isEditingEvent,
			newLocation,

			setAllEvents,
			setSelectedEvent,
			setCreateEvent,
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
			createEvent,
			hoveredEventId,
			filters,
			userLocation,
			userAccuracy,
			isTrackingUser,
			locationError,
			isCreatingEvent,
			isEditingEvent,
			newLocation,
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
