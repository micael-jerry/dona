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
			className="h-12 w-full rounded-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-[1.02]"
		>
			{label}
		</Button>
	);
}
