import { eventService } from '@/services/event.service';
import { CreateEventInput, EventModel, UpdateEventInput } from '@/types/event.type';
import { create } from 'zustand';

interface EventState {
	events: EventModel[];
	selectedEvent: EventModel | null;
	isLoading: boolean;
	error: string | null;

	// Actions
	fetchEvents: () => Promise<void>;
	fetchEventById: (id: string) => Promise<void>;
	createEvent: (data: CreateEventInput, token?: string) => Promise<EventModel>;
	updateEvent: (id: string, data: UpdateEventInput, token?: string) => Promise<void>;
	deleteEvent: (id: string, token?: string) => Promise<void>;
	setSelectedEvent: (event: EventModel | null) => void;
	clearError: () => void;
}

export const useEventStore = create<EventState>((set, get) => ({
	events: [],
	selectedEvent: null,
	isLoading: false,
	error: null,

	setSelectedEvent: (event) => set({ selectedEvent: event }),
	clearError: () => set({ error: null }),

	fetchEvents: async () => {
		set({ isLoading: true, error: null });
		try {
			const events = await eventService.getAll();
			set({ events, isLoading: false });
		} catch (err: any) {
			set({ error: err.message, isLoading: false });
		}
	},

	fetchEventById: async (id: string) => {
		set({ isLoading: true, error: null });
		try {
			const event = await eventService.getById(id);
			set({ selectedEvent: event, isLoading: false });
		} catch (err: any) {
			set({ error: err.message, isLoading: false });
		}
	},

	createEvent: async (data, token) => {
		set({ isLoading: true, error: null });
		try {
			const newEvent = await eventService.create(data, token);
			set((state) => ({
				events: [newEvent, ...state.events],
				isLoading: false,
			}));
			return newEvent;
		} catch (err: any) {
			set({ error: err.message, isLoading: false });
			throw err;
		}
	},

	updateEvent: async (id, data, token) => {
		set({ isLoading: true, error: null });
		try {
			const updatedEvent = await eventService.update(id, data, token);
			set((state) => ({
				events: state.events.map((e) => (e.id === id ? updatedEvent : e)),
				selectedEvent: state.selectedEvent?.id === id ? updatedEvent : state.selectedEvent,
				isLoading: false,
			}));
		} catch (err: any) {
			set({ error: err.message, isLoading: false });
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
		} catch (err: any) {
			set({ error: err.message, isLoading: false });
			throw err;
		}
	},
}));
