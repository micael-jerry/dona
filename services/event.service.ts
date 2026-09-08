import { useAuthStore } from '@/stores/use-auth-store';
import { ICreateEventFormData, IEventResponse } from '@/types/event.type';

class EventService {
	private readonly apiUrl: string;

	constructor() {
		this.apiUrl = process.env.NEXT_PUBLIC_API_URL!;
	}

	public async create(data: ICreateEventFormData): Promise<IEventResponse> {
		const token = typeof window !== 'undefined' ? useAuthStore.getState().token : null;
		const response: any = await fetch(`${this.apiUrl}/event`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();
		if (!response.ok) {
			throw new Error(result.message || 'Erreur de connexion.');
		}
		return result;
	}
}

export const eventService = new EventService();
