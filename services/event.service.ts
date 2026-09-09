import { EventModel, CreateEventInput, UpdateEventInput } from '@/types/event.type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const eventService = {
	async getAll(): Promise<EventModel[]> {
		const response = await fetch(`${API_BASE_URL}/events`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok) {
			throw new Error('Erreur lors de la récupération des événements');
		}

		return response.json();
	},

	async getById(id: string): Promise<EventModel> {
		const response = await fetch(`${API_BASE_URL}/events/${id}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok) {
			throw new Error(`Erreur lors de la récupération de l'événement #${id}`);
		}

		return response.json();
	},

	async create(data: CreateEventInput, token?: string): Promise<EventModel> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};
		if (token) headers['Authorization'] = `Bearer ${token}`;

		const response = await fetch(`${API_BASE_URL}/events`, {
			method: 'POST',
			headers,
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || 'Échec de la création de l’événement');
		}

		return response.json();
	},

	async update(id: string, data: UpdateEventInput, token?: string): Promise<EventModel> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};
		if (token) headers['Authorization'] = `Bearer ${token}`;

		const response = await fetch(`${API_BASE_URL}/events/${id}`, {
			method: 'PATCH',
			headers,
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || 'Échec de la mise à jour');
		}

		return response.json();
	},

	async delete(id: string, token?: string): Promise<void> {
		const headers: Record<string, string> = {};
		if (token) headers['Authorization'] = `Bearer ${token}`;

		const response = await fetch(`${API_BASE_URL}/events/${id}`, {
			method: 'DELETE',
			headers,
		});

		if (!response.ok) {
			throw new Error('Échec de la suppression de l’événement');
		}
	},
};
