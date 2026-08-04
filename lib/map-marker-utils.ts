import type { EventCategory } from '@/types/map';

/**
 * Road Incident Category Visual Config (Waze-style signaling)
 */
export const CATEGORY_COLORS: Record<
	EventCategory,
	{ bg: string; border: string; text: string; label: string; icon: string }
> = {
	accident: {
		bg: '#ef4444', // red-500
		border: '#b91c1c',
		text: '#ffffff',
		label: 'Accident',
		icon: '🚗',
	},
	traffic_jam: {
		bg: '#f97316', // orange-500
		border: '#c2410c',
		text: '#ffffff',
		label: 'Embouteillage',
		icon: '🚦',
	},
	police: {
		bg: '#3b82f6', // blue-500
		border: '#1d4ed8',
		text: '#ffffff',
		label: 'Police / Radar',
		icon: '👮',
	},
	hazard: {
		bg: '#f59e0b', // amber-500
		border: '#b45309',
		text: '#ffffff',
		label: 'Danger / Obstacle',
		icon: '⚠️',
	},
	closure: {
		bg: '#dc2626', // red-600
		border: '#991b1b',
		text: '#ffffff',
		label: 'Fermeture / Travaux',
		icon: '🚧',
	},
	other: {
		bg: '#6b7280', // gray-500
		border: '#374151',
		text: '#ffffff',
		label: 'Autre Signalement',
		icon: '❓',
	},
};

/**
 * Generates custom HTML string for Leaflet L.divIcon marker elements.
 */
export function createMarkerHtml(category: EventCategory, isSelected: boolean, isHovered: boolean): string {
	const config = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;
	const scale = isSelected ? 'scale-125 z-50' : isHovered ? 'scale-110 z-40' : 'scale-100';
	const ring = isSelected ? 'ring-4 ring-white ring-offset-2 shadow-2xl animate-pulse' : 'shadow-lg hover:shadow-xl';

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
