import { z } from 'zod';

export enum EventSeverity {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	CRITICAL = 'CRITICAL',
}

export enum EventStatus {
	ACTIVE = 'ACTIVE',
	RESOLVED = 'RESOLVED',
	DISMISSED = 'DISMISSED',
}

// Interface représentant l'entité retournée par l'API
export interface EventModel {
	id: string;
	userId: string;
	eventCategoryId: string;
	title: string;
	description: string;
	address: string;
	latitude: number;
	longitude: number;
	severity: EventSeverity;
	status: EventStatus;
	createdAt: string;
	updatedAt: string;
}

// Schéma Zod pour la création / validation du formulaire
export const createEventSchema = z.object({
	eventCategoryId: z.string().min(1, 'Veuillez sélectionner une catégorie d’événement'),
	title: z
		.string()
		.min(3, 'Le titre doit contenir au moins 3 caractères')
		.max(150, 'Le titre ne peut pas dépasser 150 caractères'),
	description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
	address: z
		.string()
		.min(5, 'L’adresse doit contenir au moins 5 caractères')
		.max(255, 'L’adresse ne peut pas dépasser 255 caractères'),
	latitude: z.number({ invalid_type_error: 'La latitude doit être un nombre' }).min(-90).max(90),
	longitude: z.number({ invalid_type_error: 'La longitude doit être un nombre' }).min(-180).max(180),
	severity: z.nativeEnum(EventSeverity).optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// Schéma Zod pour la mise à jour (champs optionnels + statut)
export const updateEventSchema = createEventSchema.partial().extend({
	status: z.nativeEnum(EventStatus).optional(),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>;
