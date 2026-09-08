export interface IEvent {
	id: string;
	eventCategoryId: string;
	severityLevel: 'MINOR' | 'MODERATE' | 'MAJOR';
	statusLevel: 'ACTIVE' | 'RESOLVING' | 'EXPIRED';
	coords: string;
	title: string;
	description: string;
	address: string;
}

export interface ICreateEventFormData {
	name: string;
}

export interface IEventState {
	event: IEvent | null;
	token: string | null;
	isLoading: boolean;
	error: string | null;
	create: (data: ICreateEventFormData) => Promise<void>;
	clearError: () => void;
	setEvent: (event: IEvent) => void;
}

export interface IEventResponse {
	// user: Omit<IUser, 'password'>;
	event: IEvent | null;
	access_token: string;
}
