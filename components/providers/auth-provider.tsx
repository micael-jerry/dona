'use client';

import { ReactNode } from 'react';
import { AuthInitializer } from '@/components/providers/auth-initializer';

export function AuthProvider({ children }: { children: ReactNode }) {
	return <AuthInitializer>{children}</AuthInitializer>;
}

export { useAuth } from '@/hooks/use-auth';
export type { AuthResult } from '@/store/use-auth-store';
