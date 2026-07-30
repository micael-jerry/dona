import type { DonaEvent } from '@/types/map';

/**
 * Initial sample events for Dona map.
 * Represents community and donation events in Paris and surrounding areas.
 */
export const MOCK_DONA_EVENTS: DonaEvent[] = [
	{
		id: 'evt-1',
		title: 'Grande Collecte Alimentaire Solidaire',
		description:
			'Rejoignez notre équipe bénévoles pour distribuer des paniers repas et denrées alimentaires aux familles du quartier.',
		location: { lat: 48.8566, lng: 2.3522 },
		addressName: 'Place de l’Hôtel de Ville, 75004 Paris',
		category: 'food_drive',
		status: 'upcoming',
		date: '2026-08-05',
		time: '10:00 - 16:00',
		organizer: {
			name: 'Association Dona Paris',
			avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
		},
		attendeesCount: 34,
		maxAttendees: 50,
		imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop',
	},
	{
		id: 'evt-2',
		title: 'Atelier Réparation & Recyclage communautaire',
		description: 'Apportez vos appareils électroniques ou vêtements à réparer ensemble avec des artisans locaux.',
		location: { lat: 48.8738, lng: 2.295 },
		addressName: 'Place Charles de Gaulle, 75008 Paris',
		category: 'community',
		status: 'upcoming',
		date: '2026-08-08',
		time: '14:00 - 18:00',
		organizer: {
			name: 'FabLab ÉcoCitoyen',
		},
		attendeesCount: 18,
		maxAttendees: 25,
		imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop',
	},
	{
		id: 'evt-3',
		title: 'Nettoyage des Berges de Seine',
		description: 'Action environnementale citoyenne pour nettoyer les quais et sensibiliser à la protection du fleuve.',
		location: { lat: 48.8462, lng: 2.3372 },
		addressName: 'Jardin du Luxembourg, 75006 Paris',
		category: 'environment',
		status: 'ongoing',
		date: '2026-07-30',
		time: '09:00 - 13:00',
		organizer: {
			name: 'Clean Seine Collective',
		},
		attendeesCount: 52,
		imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop',
	},
	{
		id: 'evt-4',
		title: 'Soutien Scolaire & Don de Fournitures',
		description: 'Collecte et distribution de cahiers, stylos et livres pour la rentrée des élèves défavorisés.',
		location: { lat: 48.8867, lng: 2.3431 },
		addressName: 'Montmartre, 75018 Paris',
		category: 'education',
		status: 'upcoming',
		date: '2026-08-12',
		time: '11:00 - 17:00',
		organizer: {
			name: 'Éducation Pour Tous',
		},
		attendeesCount: 27,
		maxAttendees: 40,
		imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop',
	},
	{
		id: 'evt-5',
		title: 'Gala de Bienfaisance Dona',
		description: 'Soirée caritative d’appel aux dons pour financer nos projets de maraudes d’hiver.',
		location: { lat: 48.8606, lng: 2.3376 },
		addressName: 'Palais Royal, 75001 Paris',
		category: 'charity',
		status: 'upcoming',
		date: '2026-08-20',
		time: '19:00 - 23:00',
		organizer: {
			name: 'Fondation Dona',
		},
		attendeesCount: 89,
		maxAttendees: 150,
		imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop',
	},
];
