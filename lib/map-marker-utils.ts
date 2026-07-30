import type { EventCategory } from '@/types/map';

/**
 * Category color definitions for map markers.
 */
export const CATEGORY_COLORS: Record<
	EventCategory,
	{ bg: string; border: string; text: string; label: string; icon: string }
> = {
	food_drive: {
		bg: '#f97316', // orange-500
		border: '#ea580c',
		text: '#ffffff',
		label: 'Banque Alimentaire',
		icon: '🍲',
	},
	community: {
		bg: '#0284c7', // sky-600
		border: '#0369a1',
		text: '#ffffff',
		label: 'Communauté',
		icon: '🤝',
	},
	environment: {
		bg: '#10b981', // emerald-500
		border: '#059669',
		text: '#ffffff',
		label: 'Écologie',
		icon: '🌱',
	},
	education: {
		bg: '#8b5cf6', // violet-500
		border: '#7c3aed',
		text: '#ffffff',
		label: 'Éducation',
		icon: '📚',
	},
	charity: {
		bg: '#f43f5e', // rose-500
		border: '#e11d48',
		text: '#ffffff',
		label: 'Caritatif & Dons',
		icon: '❤️',
	},
};

/**
 * Generates custom HTML string for Leaflet L.divIcon marker elements.
 */
export function createMarkerHtml(category: EventCategory, isSelected: boolean, isHovered: boolean): string {
	const config = CATEGORY_COLORS[category] || CATEGORY_COLORS.community;
	const scale = isSelected ? 'scale-125 z-50' : isHovered ? 'scale-110 z-40' : 'scale-100';
	const ring = isSelected ? 'ring-4 ring-white ring-offset-2 shadow-2xl' : 'shadow-lg hover:shadow-xl';

	return `
    <div class="relative flex items-center justify-center transition-all duration-200 ease-out transform ${scale}">
      <div 
        class="flex h-10 w-10 items-center justify-center rounded-2xl ${ring} text-base transition-transform"
        style="background-color: ${config.bg}; border: 2px solid ${config.border}; color: ${config.text};"
      >
        <span>${config.icon}</span>
      </div>
      <div 
        class="absolute -bottom-1 h-2 w-2 rotate-45 rounded-xs" 
        style="background-color: ${config.bg};"
      ></div>
    </div>
  `;
}
