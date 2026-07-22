'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const emptySubscribe = () => () => {};

function useHasMounted() {
	return React.useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);
}

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useHasMounted();

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0">
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	const isDark = resolvedTheme === 'dark';

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className="h-9 w-9 rounded-xl text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground"
			title="Toggle Theme (or press 'D')"
		>
			{isDark ? (
				<Sun className="h-4 w-4 rotate-0 text-amber-400 transition-transform duration-300 hover:rotate-90" />
			) : (
				<Moon className="h-4 w-4 rotate-0 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
