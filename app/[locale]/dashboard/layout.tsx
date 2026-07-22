import { ReactNode } from 'react';
import { AppHeader } from '@/components/common/app-header';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<ProtectedRoute>
			<div className="flex min-h-screen flex-col bg-background text-foreground">
				<AppHeader />
				<main className="mt-20 flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
			</div>
		</ProtectedRoute>
	);
}
