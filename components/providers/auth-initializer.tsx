'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/use-auth-store';

export function AuthInitializer({ children }: { children: ReactNode }) {
	useEffect(() => {
		useAuthStore.getState().initialize();
	}, []);

	return <>{children}</>;
}
