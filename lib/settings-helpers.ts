import { updateUserSettings } from '@/lib/api';
import type { Theme as DbTheme, Language as DbLanguage } from '@/client/types.gen';

export function setLocaleCookie(locale: string) {
	if (typeof document !== 'undefined') {
		document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
	}
}

export function dbToTheme(dbTheme?: DbTheme): string {
	if (dbTheme === 'LIGHT') return 'light';
	if (dbTheme === 'DARK') return 'dark';
	if (dbTheme === 'SYSTEM') return 'system';
	return 'system';
}

export function themeToDb(theme?: string): DbTheme {
	if (theme === 'light') return 'LIGHT';
	if (theme === 'dark') return 'DARK';
	return 'SYSTEM';
}

export function dbToLocale(dbLang?: DbLanguage): string {
	if (dbLang === 'FR') return 'fr';
	if (dbLang === 'EN') return 'en';
	if (dbLang === 'ES') return 'es';
	return 'fr';
}

export function localeToDb(locale?: string): DbLanguage {
	if (locale === 'en') return 'EN';
	if (locale === 'es') return 'ES';
	return 'FR';
}

/**
 * Persists settings to DB via API asynchronously without blocking UI.
 */
export async function syncSettingsToDb(options: { theme?: string; locale?: string }) {
	try {
		const payload: { theme?: DbTheme; language?: DbLanguage } = {};
		if (options.theme) {
			payload.theme = themeToDb(options.theme);
		}
		if (options.locale) {
			payload.language = localeToDb(options.locale);
		}
		await updateUserSettings({ body: payload });
	} catch (err) {
		console.warn('Failed to sync user settings to DB:', err);
	}
}
