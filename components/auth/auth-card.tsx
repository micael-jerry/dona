import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/common/theme-toggle';

interface AuthCardProps {
	children: React.ReactNode;
	/** 'login' swaps the blob positions to differentiate the two pages */
	variant?: 'login' | 'register';
	className?: string;
}

export function AuthCard({ children, variant = 'login', className }: AuthCardProps) {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
			{/* Background ambient lighting */}
			<div className="pointer-events-none absolute top-0 left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-linear-to-b from-sky-500/20 via-cyan-400/10 to-transparent blur-[130px]" />
			<div className="pointer-events-none absolute right-10 bottom-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[110px]" />

			{/* Top Bar Logo & Theme Toggle */}
			<div className="absolute top-6 right-6 left-6 z-20 flex items-center justify-between">
				<Link className="group flex items-center gap-2.5" href="/">
					<div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 p-1.5 transition-transform group-hover:scale-105">
						<Image src="/dona_app_logo.svg" fill className="object-contain p-1" alt="Dona Logo" />
					</div>
					<span className="bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
						Dona
					</span>
				</Link>
				<ThemeToggle />
			</div>

			<Card
				className={cn(
					'relative z-10 overflow-hidden rounded-3xl border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 sm:p-8',
					variant === 'login' ? 'w-full max-w-md' : 'my-8 w-full max-w-lg',
					className,
				)}
			>
				{children}
			</Card>
		</div>
	);
}
