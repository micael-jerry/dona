/**
 * ─── Dona Road Incident & Map Domain Types ────────────────────────────────────
 *
 * Strongly typed definitions for road events (Waze-style signaling),
 * community veracity ratings, categories, and map interaction states.
 */

export interface GeoLocation {
	lat: number;
	lng: number;
}

export interface UserLocationState {
	coords: GeoLocation | null;
	accuracy?: number;
	heading?: number | null;
	speed?: number | null;
	isTracking: boolean;
	isCustomPosition?: boolean;
	error?: string | null;
}

export interface MapBounds {
	northEast: GeoLocation;
	southWest: GeoLocation;
}

/**
 * Predefined Road Incident Categories (Waze-style)
 */
export type EventCategory = 'accident' | 'traffic_jam' | 'police' | 'hazard' | 'closure' | 'other';

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

export type EventStatus = 'active' | 'resolving' | 'expired';

export interface DonaEvent {
	id: string;
	title: string;
	description: string;
	location: GeoLocation;
	addressName: string;
	category: EventCategory;
	severity: EventSeverity;
	status: EventStatus;
	veracityScore: number; // 0 to 100%
	confirmationsCount: number; // "Still there" votes
	resolutionsCount: number; // "Resolved" votes
	isOfficialValidated?: boolean; // Validated by Traffic Police / Ministry
	createdAt: string;
	reportedBy: {
		isOwner: boolean;
		name: string;
		avatarUrl?: string;
		reputationScore?: number;
	};
	imageUrl?: string;
}

export interface MapFilterState {
	category: EventCategory | 'all';
	searchQuery: string;
}

export type TileLayerType = 'street' | 'satellite';
