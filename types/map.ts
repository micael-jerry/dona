/**
 * ─── Map & Event Domain Types ────────────────────────────────────────────────
 *
 * Strongly typed definitions for map coordinates, events, filters, and interaction states.
 * Designed following SOLID principles for easy extensibility when adding new layer
 * types, filters, or backend integrations.
 */

export interface GeoLocation {
	lat: number;
	lng: number;
}

export interface MapBounds {
	northEast: GeoLocation;
	southWest: GeoLocation;
}

export type EventCategory = 'charity' | 'community' | 'food_drive' | 'environment' | 'education';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed';

export interface DonaEvent {
	id: string;
	title: string;
	description: string;
	location: GeoLocation;
	addressName: string;
	category: EventCategory;
	status: EventStatus;
	date: string;
	time: string;
	organizer: {
		name: string;
		avatarUrl?: string;
	};
	attendeesCount: number;
	maxAttendees?: number;
	imageUrl?: string;
}

export interface MapFilterState {
	category: EventCategory | 'all';
	searchQuery: string;
}

export type TileLayerType = 'street' | 'satellite';
