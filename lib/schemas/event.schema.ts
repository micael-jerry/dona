import { z } from 'zod';

export const createEventSchema = z.object({
	name: z
		.string()
		.min(3, 'Le nom doit contenir au moins 3 caractères.')
		.max(20, 'Le nom doit contenir au plus 20 caractères.')
		.optional(),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
