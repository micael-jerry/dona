'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { getUserSettings } from '@/lib/api';
import { dbToLocale, dbToTheme, setLocaleCookie } from '@/lib/settings-helpers';
import { usePathname, useRouter } from '@/i18n/routing';

export function UserSettingsInitializer({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAuth();
	const currentLocale = useLocale();
	const pathname = usePathname();
	const router = useRouter();
	const { setTheme } = useTheme();

	const hasSyncedRef = useRef(false);

	useEffect(() => {
		if (!isAuthenticated || hasSyncedRef.current) return;
		hasSyncedRef.current = true;

		getUserSettings()
			.then((res) => {
				if (res.data && !res.error) {
					const { theme, language } = res.data;

					// Sync Theme if available in DB
					if (theme) {
						const localTheme = dbToTheme(theme);
						setTheme(localTheme);
					}

					// Sync Locale if available in DB
					if (language) {
						const targetLocale = dbToLocale(language);
						if (targetLocale !== currentLocale) {
							setLocaleCookie(targetLocale);
							router.replace(pathname, { locale: targetLocale });
							router.refresh();
						}
					}
				}
			})
			.catch(() => {
				// Silently fallback to local state if offline or endpoint unavailable
			});
	}, [isAuthenticated, currentLocale, pathname, router, setTheme]);

	return <>{children}</>;
}
