import { eventService } from '@/services/event.service';
import { CreateEventInput, EventModel, UpdateEventInput } from '@/types/event.type';
import { DonaEvent } from '@/types/map';
import { create } from 'zustand';

interface EventState {
	events: DonaEvent[];
	selectedEvent: EventModel | null;
	isLoading: boolean;
	error: string | null;

	// Actions
	fetchEvents: (token?: string) => Promise<void>;
	fetchEventById: (id: string) => Promise<void>;
	createEvent: (data: CreateEventInput, token?: string) => Promise<DonaEvent>;
	confirmEvent: (eventId: string, token: string) => Promise<void>;
	updateEvent: (id: string, data: UpdateEventInput, token?: string) => Promise<void>;
	deleteEvent: (id: string, token?: string) => Promise<void>;
	setSelectedEvent: (event: EventModel | null) => void;
	clearError: () => void;
}

export const useEventStore = create<EventState>((set) => ({
	events: [],
	selectedEvent: null,
	isLoading: false,
	error: null,

	setSelectedEvent: (event) => set({ selectedEvent: event }),
	clearError: () => set({ error: null }),

	fetchEvents: async (token) => {
		set({ isLoading: true, error: null });
		try {
			const events = await eventService.getAllPersonalized(token);
			set({ events, isLoading: false });
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching events.';
			set({ error: errorMessage, isLoading: false });
		}
	},

	fetchEventById: async (id: string) => {
		set({ isLoading: true, error: null });
		try {
			const event = await eventService.getById(id);
			set({ selectedEvent: event, isLoading: false });
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching events.';
			set({ error: errorMessage, isLoading: false });
		}
	},

	createEvent: async (data, token) => {
		set({ isLoading: true, error: null });
		try {
			const newEventModel = await eventService.create(data, token);

			const personalizedEvent = await eventService.getOnePersonalized(newEventModel.id, token);

			set((state) => ({
				events: [personalizedEvent, ...state.events],
				isLoading: false,
			}));

			return personalizedEvent;
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching events.';
			set({ error: errorMessage, isLoading: false });
			throw err;
		}
	},

	confirmEvent: async (eventId: string, token: string) => {
		try {
			const updatedEvent = await eventService.confirm(eventId, token);

			set((state) => ({
				events: state.events.map((e) => (e.id === eventId ? updatedEvent : e)),
				selectedEvent: state.selectedEvent?.id === eventId ? (updatedEvent as any) : state.selectedEvent,
			}));
		} catch (err: unknown) {
			console.error('Error confirming event:', err);
			throw err;
		}
	},

	updateEvent: async (id, data, token) => {
		set({ isLoading: true, error: null });
		try {
			await eventService.update(id, data, token);

			const updatedPersonalized = await eventService.getOnePersonalized(id, token);

			set((state) => ({
				events: state.events.map((e) => (e.id === id ? updatedPersonalized : e)),
				isLoading: false,
			}));
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching events.';
			set({ error: errorMessage, isLoading: false });
			throw err;
		}
	},

	deleteEvent: async (id, token) => {
		set({ isLoading: true, error: null });
		try {
			await eventService.delete(id, token);
			set((state) => ({
				events: state.events.filter((e) => e.id !== id),
				selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent,
				isLoading: false,
			}));
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching events.';
			set({ error: errorMessage, isLoading: false });
			throw err;
		}
	},
}));
