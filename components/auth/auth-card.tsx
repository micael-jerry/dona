import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthCardProps {
	children: React.ReactNode;
	/** 'login' swaps the blob positions to differentiate the two pages */
	variant?: 'login' | 'register';
	className?: string;
}

export function AuthCard({ children, variant = 'login', className }: AuthCardProps) {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
			{/* Decorative blobs */}
			{variant === 'login' ? (
				<>
					<div className="pointer-events-none absolute top-0 left-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
					<div className="pointer-events-none absolute right-1/3 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/20 blur-[120px]" />
				</>
			) : (
				<>
					<div className="pointer-events-none absolute top-0 right-1/3 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]" />
					<div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
				</>
			)}

			<Card
				className={cn(
					'relative z-10 overflow-hidden rounded-3xl border-border/50 bg-background/60 shadow-2xl backdrop-blur-xl',
					variant === 'login' ? 'w-full max-w-md' : 'my-8 w-full max-w-lg',
					className,
				)}
			>
				{children}
			</Card>
		</div>
	);
}
