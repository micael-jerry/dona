import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<ProtectedRoute>
			<SidebarProvider>
				<DashboardSidebar />
				<SidebarInset className="flex min-h-svh flex-col bg-background">
					<DashboardNavbar />
					<main className="flex-1 overflow-auto p-6">{children}</main>
				</SidebarInset>
			</SidebarProvider>
		</ProtectedRoute>
	);
}
