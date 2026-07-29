import { type ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar';

/**
 * Map layout:
 * - Full-viewport so the Leaflet canvas fills the screen.
 * - Protected — unauthenticated users are redirected to /login.
 * - Shares the same sidebar + navbar shell as /dashboard.
 *
 * Key CSS decisions:
 *   overflow-hidden + h-svh   → prevents the SidebarInset from scrolling.
 *   min-h-0 flex-1            → lets the <main> take remaining vertical space
 *                               without pushing the navbar off-screen.
 *   relative                  → provides the positioning context for the
 *                               `absolute inset-0` map canvas inside MapView.
 */
export default function MapLayout({ children }: { children: ReactNode }) {
	return (
		<ProtectedRoute>
			<SidebarProvider>
				<DashboardSidebar />
				{/*
				 * h-svh: constrains to the viewport height.
				 * NO overflow-hidden here — that would create a clipping context
				 * that prevents the fixed-position Dialog/Backdrop from showing.
				 * The map canvas manages its own bounds via `absolute inset-0`.
				 */}
				<SidebarInset className="flex h-svh flex-col bg-background">
					<DashboardNavbar />
					{/*
					 * isolate: creates a new stacking context so Leaflet's internal
					 * z-indices (400, 600, etc.) are scoped and don't bleed out
					 * above the sidebar/dialog layer.
					 * relative: required for the `absolute inset-0` map canvas.
					 * overflow-hidden: clips the map canvas to the <main> bounds
					 * without affecting `fixed` elements (fixed breaks out of overflow).
					 */}
					<main className="relative isolate min-h-0 flex-1 overflow-hidden">{children}</main>
				</SidebarInset>
			</SidebarProvider>
		</ProtectedRoute>
	);
}
