import { eventService } from '@/services/event.service';
import { ICreateEventFormData, IEvent, IEventState } from '@/types/event.type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useEventStore = create<IEventState>()(
	persist(
		(set, get) => ({
			event: null,
			token: null,
			isLoading: false,
			error: null,
			create: async (data: ICreateEventFormData) => {
				set({ isLoading: true, error: null });
				try {
					const result = await eventService.create(data);
					set({
						event: result.event as IEvent,
						token: result.access_token,
						isLoading: false,
					});
				} catch (error) {
					set({
						error: error instanceof Error ? error.message : 'Une erreur est survenue.',
						isLoading: false,
					});
					throw error;
				}
			},
			clearError: () => set({ error: null }),
			setEvent: (event: IEvent) => set({ event }),
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({ user: state.event, token: state.token }),
		},
	),
);
