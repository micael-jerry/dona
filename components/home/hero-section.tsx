'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	AlertTriangle,
	ArrowRight,
	Bot,
	CheckCircle2,
	Clock,
	MessageSquare,
	Navigation,
	ShieldAlert,
	ShieldCheck,
	Sparkles,
	ThumbsUp,
	Users,
	Zap,
} from 'lucide-react';

type TranslationFn = ReturnType<typeof useTranslations<'HomePage'>>;

interface HeroSectionProps {
	t?: TranslationFn;
}

export function HeroSection({ t: propT }: HeroSectionProps = {}) {
	const defaultT = useTranslations('HomePage');
	const t = propT ?? defaultT;
	const [activeTab, setActiveTab] = React.useState<'all' | 'accidents' | 'hazards' | 'police'>('all');

	const mockEvents = [
		{
			id: 1,
			type: 'accidents',
			icon: ShieldAlert,
			iconColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
			title: 'Major Collision — Lane Blocked',
			location: 'Highway A1 North bound • KM 42',
			veracity: 98,
			votes: 18,
			time: '2m ago',
			verified: true,
			official: false,
			aiVerified: true,
			badge: 'High Impact',
			badgeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-500',
		},
		{
			id: 2,
			type: 'police',
			icon: ShieldCheck,
			iconColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
			title: 'Speed Control & Inspection',
			location: 'East Bypass Exit 4',
			veracity: 100,
			votes: 34,
			time: '5m ago',
			verified: true,
			official: true,
			aiVerified: false,
			badge: 'Official Validation',
			badgeColor: 'border-sky-500/30 bg-sky-500/10 text-sky-500',
		},
		{
			id: 3,
			type: 'hazards',
			icon: AlertTriangle,
			iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
			title: 'Debris on Roadway — Slippery Surface',
			location: 'Boulevard Saint-Michel',
			veracity: 86,
			votes: 9,
			time: '12m ago',
			verified: false,
			official: false,
			aiVerified: true,
			badge: 'Reroute Active',
			badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
		},
	];

	const filteredEvents = activeTab === 'all' ? mockEvents : mockEvents.filter((e) => e.type === activeTab);

	return (
		<section className="relative flex flex-col items-center justify-center overflow-hidden pt-8 pb-20 md:pt-16 md:pb-32">
			{/* Decorative Glow Elements */}
			<div className="pointer-events-none absolute top-10 left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-linear-to-tr from-sky-500/20 via-cyan-400/15 to-indigo-600/10 blur-[130px]" />
			<div className="pointer-events-none absolute top-1/3 right-10 h-96 w-96 rounded-full bg-amber-500/10 blur-[110px]" />

			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Top Announcement Badge */}
				<div className="mb-6 flex justify-center">
					<Badge
						variant="outline"
						className="inline-flex items-center gap-2 rounded-full border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-600 shadow-xs backdrop-blur-md transition-all hover:border-sky-500/50 hover:bg-sky-500/15 sm:text-sm dark:text-sky-300"
					>
						<span className="relative flex h-2 w-2">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
							<span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
						</span>
						<span>{t('announcement')}</span>
						<Sparkles className="h-3.5 w-3.5 text-amber-400" />
					</Badge>
				</div>

				{/* Main Headline */}
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="mb-6 text-4xl leading-[1.1] font-black tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
						{t('headlineFirst')} <br />
						<span className="bg-linear-to-r from-sky-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
							{t('headlineSecond')}
						</span>
					</h1>

					<p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
						{t('heroDescription')}
					</p>

					{/* Action Buttons */}
					<div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
						<Link href="/map" className="w-full sm:w-auto">
							<Button
								size="lg"
								className="h-13 w-full rounded-xl bg-linear-to-r from-sky-500 via-cyan-500 to-indigo-600 px-8 text-base font-bold text-white shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.02] hover:shadow-sky-500/40 active:scale-[0.98] sm:w-auto"
							>
								<Navigation className="mr-2 h-5 w-5" />
								{t('playNow')}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
						<Link href="/register" className="w-full sm:w-auto">
							<Button
								size="lg"
								variant="outline"
								className="h-13 w-full rounded-xl border-2 border-border/80 bg-background/60 px-8 text-base font-bold text-foreground backdrop-blur-md transition-all hover:bg-muted sm:w-auto"
							>
								{t('joinNetwork')}
							</Button>
						</Link>
					</div>
				</div>

				{/* Live Interactive Preview Radar Widget */}
				<div className="mx-auto max-w-5xl rounded-3xl border border-border/60 bg-card/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6 md:p-8">
					<div className="flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-500">
								<Zap className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-lg font-bold text-foreground">{t('feedPreviewTitle')}</h3>
								<p className="text-xs text-muted-foreground">{t('feedPreviewSubtitle')}</p>
							</div>
						</div>

						{/* Category Tabs using shadcn Tabs */}
						<Tabs
							value={activeTab}
							onValueChange={(val) => setActiveTab(val as 'all' | 'accidents' | 'hazards' | 'police')}
						>
							<TabsList className="h-9 rounded-xl bg-muted/60 p-1">
								<TabsTrigger value="all" className="rounded-lg text-xs font-semibold">
									{t('tabs.all')}
								</TabsTrigger>
								<TabsTrigger value="accidents" className="rounded-lg text-xs font-semibold">
									{t('tabs.accidents')}
								</TabsTrigger>
								<TabsTrigger value="police" className="rounded-lg text-xs font-semibold">
									{t('tabs.police')}
								</TabsTrigger>
								<TabsTrigger value="hazards" className="rounded-lg text-xs font-semibold">
									{t('tabs.hazards')}
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					{/* Event Items List */}
					<div className="mt-5 flex flex-col gap-3">
						{filteredEvents.map((event) => {
							const IconComponent = event.icon;
							return (
								<div
									key={event.id}
									className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-border/40 bg-background/50 p-4 transition-all duration-300 hover:border-sky-500/40 hover:bg-background/80 hover:shadow-md sm:flex-row sm:items-center"
								>
									<div className="flex items-start gap-3.5">
										<div
											className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${event.iconColor}`}
										>
											<IconComponent className="h-5 w-5" />
										</div>
										<div>
											<div className="flex flex-wrap items-center gap-2">
												<h4 className="text-sm font-bold text-foreground sm:text-base">{event.title}</h4>
												<Badge
													variant="outline"
													className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${event.badgeColor}`}
												>
													{event.badge}
												</Badge>
											</div>
											<p className="mt-0.5 text-xs text-muted-foreground">{event.location}</p>

											<div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-muted-foreground">
												<span className="flex items-center gap-1 text-emerald-500">
													<ThumbsUp className="h-3 w-3" /> {event.votes} Signals
												</span>
												<span className="flex items-center gap-1">
													<Clock className="h-3 w-3" /> {event.time}
												</span>
												{event.official && (
													<span className="flex items-center gap-1 text-sky-500">
														<CheckCircle2 className="h-3 w-3" /> Municipality Validated
													</span>
												)}
												{event.aiVerified && (
													<span className="flex items-center gap-1 text-purple-400">
														<Bot className="h-3 w-3" /> AI Vision Checked
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Veracity Badge */}
									<div className="flex w-full items-center justify-between gap-3 border-t border-border/30 pt-3 sm:w-auto sm:justify-end sm:border-0 sm:pt-0">
										<div className="text-right">
											<div className="text-xs font-semibold text-muted-foreground">Credibility Score</div>
											<div className="text-base font-black text-sky-500">{event.veracity}% Veracity</div>
										</div>
										<Button size="sm" variant="secondary" className="gap-1 rounded-xl text-xs font-bold">
											<MessageSquare className="h-3.5 w-3.5" />
											Live Chat
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Platform Feature Cards */}
				<div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-md transition-all hover:border-sky-500/30 hover:shadow-lg">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-500">
							<Zap className="h-6 w-6" />
						</div>
						<h3 className="mb-2 text-lg font-bold text-foreground">{t('features.signalingTitle')}</h3>
						<p className="text-sm leading-relaxed text-muted-foreground">{t('features.signalingDesc')}</p>
					</div>

					<div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-md transition-all hover:border-amber-500/30 hover:shadow-lg">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
							<ShieldCheck className="h-6 w-6" />
						</div>
						<h3 className="mb-2 text-lg font-bold text-foreground">{t('features.veracityTitle')}</h3>
						<p className="text-sm leading-relaxed text-muted-foreground">{t('features.veracityDesc')}</p>
					</div>

					<div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-md transition-all hover:border-indigo-500/30 hover:shadow-lg">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-500">
							<Bot className="h-6 w-6" />
						</div>
						<h3 className="mb-2 text-lg font-bold text-foreground">{t('features.reroutingTitle')}</h3>
						<p className="text-sm leading-relaxed text-muted-foreground">{t('features.reroutingDesc')}</p>
					</div>

					<div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-md transition-all hover:border-emerald-500/30 hover:shadow-lg">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
							<Users className="h-6 w-6" />
						</div>
						<h3 className="mb-2 text-lg font-bold text-foreground">{t('features.chatTitle')}</h3>
						<p className="text-sm leading-relaxed text-muted-foreground">{t('features.chatDesc')}</p>
					</div>
				</div>
			</div>
		</section>
	);
}
