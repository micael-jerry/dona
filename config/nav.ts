import { LayoutDashboard, MapPin, User, type LucideIcon } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * A single navigation item rendered in the sidebar menu.
 *
 * To add a new page to the sidebar:
 *  1. Add a new entry to `NAV_ITEMS` (or a new `NAV_GROUPS` entry).
 *  2. Create the page/route under `app/[locale]/<your-route>/`.
 *  3. Add the i18n key if `label` uses a translation key.
 *
 * That's it — the sidebar and layout pick everything up automatically.
 */
export interface NavItem {
	/** i18n key resolved by `useTranslations('Navigation')`, or a static string. */
	labelKey: string;
	/** Route path (without locale prefix). E.g. `/dashboard`. */
	href: string;
	/** Lucide icon component. */
	icon: LucideIcon;
	/**
	 * Optional: restrict visibility to specific roles.
	 * If omitted, the item is visible to all authenticated users.
	 */
	roles?: string[];
}

/**
 * A named group of nav items shown under a collapsible label in the sidebar.
 *
 * To add a new group:
 *  1. Add a new entry to `NAV_GROUPS`.
 *  2. Populate `items` with `NavItem` entries.
 */
export interface NavGroup {
	/** i18n key resolved by `useTranslations('Navigation')`, or a static string. */
	labelKey: string;
	items: NavItem[];
}

// ─── Navigation Config ────────────────────────────────────────────────────────
//
// ✅ ADD NEW MENU ITEMS HERE
// ✅ ADD NEW GROUPS HERE
//
// labelKey maps to `messages/{locale}.json` under the `Navigation` namespace.
// Example:  labelKey: 'dashboard'  →  t('dashboard')
//           labelKey: 'map'        →  t('map')
//
// ─────────────────────────────────────────────────────────────────────────────

export const NAV_GROUPS: NavGroup[] = [
	{
		labelKey: 'mainGroup',
		items: [
			{
				labelKey: 'dashboard',
				href: '/dashboard',
				icon: LayoutDashboard,
			},
			{
				labelKey: 'map',
				href: '/map',
				icon: MapPin,
			},
			{
				labelKey: 'account',
				href: '/account',
				icon: User,
			},
			// ── Add new items below ──────────────────────────────────────────
			// {
			//   labelKey: 'leaderboard',
			//   href: '/leaderboard',
			//   icon: Trophy,
			// },
		],
	},
	// ── Add new groups below ───────────────────────────────────────────────────
	// {
	//   labelKey: 'adminGroup',
	//   items: [
	//     { labelKey: 'users', href: '/admin/users', icon: Users, roles: ['ADMIN'] },
	//   ],
	// },
];
