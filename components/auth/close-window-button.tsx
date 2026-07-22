'use client';

import { Button } from '@/components/ui/button';

interface CloseWindowButtonProps {
	label: string;
}

export function CloseWindowButton({ label }: CloseWindowButtonProps) {
	const handleClose = () => {
		if (typeof window !== 'undefined') {
			window.close();
		}
	};

	return (
		<Button
			onClick={handleClose}
			className="h-12 w-full rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 font-bold text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98]"
		>
			{label}
		</Button>
	);
}
