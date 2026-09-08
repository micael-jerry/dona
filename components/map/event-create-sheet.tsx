'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { CreateEventFormData, createEventSchema } from '@/lib/schemas/event.schema';
import { useEventStore } from '@/stores/event.store';
import { useAuthStore } from '@/stores/use-auth-store';
import { ICreateEventFormData } from '@/types/event.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, MapPin, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMapContext } from './map-provider';

type EventCategory = 'accident' | 'traffic_jam' | 'police' | 'hazard' | 'closure' | 'other';
type EventSeverity = 'minor' | 'moderate' | 'major';

export function EventCreateSheet() {
	const t = useTranslations('EventCreateSheet');
	const { isCreatingEvent, newLocation, setNewLocation, createEvent, setCreateEvent } = useMapContext();
	const { user } = useAuthStore();
	const { create, isLoading } = useEventStore();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState<EventCategory>('hazard');
	const [severity, setSeverity] = useState<EventSeverity>('minor');
	const [imageUrl, setImageUrl] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const form = useForm<CreateEventFormData>({
		resolver: zodResolver(createEventSchema),
		defaultValues: {
			name: '',
		},
	});

	// useEffect(() => {
	// 	if (user) {
	// 		form.reset({
	// 			name: user.name,
	// 			email: user.email,
	// 		});
	// 	}
	// }, [user]);

	const onSubmit = async (data: CreateEventFormData) => {
		alert('ho');
		if (!newLocation || !user) return;
		setError(null);
		setSuccess(null);

		try {
			await create(data as ICreateEventFormData);
			setSuccess('Événement créé avec succès !');
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Une erreur est survenue.');
		}
	};

	const resetForm = () => {
		setTitle('');
		setDescription('');
		setCategory('hazard');
		setSeverity('minor');
		setImageUrl('');
	};

	return (
		<Sheet
			open={!!isCreatingEvent}
			onOpenChange={(event, open) => {
				if (!open) {
					const target = (event as any)?.target as HTMLElement | undefined;
					const isCloseButton = target?.closest('[data-slot="sheet-close"]');
					if (!isCloseButton) return;
				}
				setNewLocation(null);
			}}
			modal={false}
		>
			<SheetContent
				side="right"
				className="pointer-events-auto w-full overflow-y-auto p-0 sm:max-w-md [*:has(&):has([data-slot=sheet-overlay])_[data-slot=sheet-overlay]]:pointer-events-none [*:has(&):has([data-slot=sheet-overlay])_[data-slot=sheet-overlay]]:hidden"
			>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
					<SheetHeader className="space-y-1 p-0 text-left">
						<SheetTitle className="text-xl font-bold">{t('title')}</SheetTitle>
						<SheetDescription className="text-sm text-muted-foreground">{t('description')}</SheetDescription>
					</SheetHeader>

					{newLocation && (
						<div className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-muted/40 p-3 text-xs font-medium text-foreground">
							<MapPin className="h-4 w-4 shrink-0 text-rose-500" />
							<span className="truncate">
								{newLocation.lat.toFixed(5)}, {newLocation.lng.toFixed(5)}
							</span>
						</div>
					)}

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
								{t('titleFieldTitle')} *
							</Label>
							<Input
								id="title"
								required
								placeholder={t('titleFieldPlaceholder')}
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="category" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
								{t('categoryFieldTitle')} *
							</Label>
							<Select value={category} onValueChange={(val) => setCategory(val as EventCategory)}>
								<SelectTrigger id="category">
									<span>{category ? t(`eventCategory.${category}`) : 'Sélectionner une catégorie'}</span>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="accident">{t('eventCategory.accident')}</SelectItem>
									<SelectItem value="traffic_jam">{t('eventCategory.traffic_jam')}</SelectItem>
									<SelectItem value="police">{t('eventCategory.police')}</SelectItem>
									<SelectItem value="hazard">{t('eventCategory.hazard')}</SelectItem>
									<SelectItem value="closure">{t('eventCategory.closure')}</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="severity" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
								{t('severityFieldTitle')} *
							</Label>
							<Select value={severity} onValueChange={(val) => setSeverity(val as EventSeverity)}>
								<SelectTrigger id="severity">
									<span>{severity ? t(`severityLevel.${severity}`) : 'Sélectionner un niveau de sévérité'}</span>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="minor">{t('severityLevel.minor')}</SelectItem>
									<SelectItem value="moderate">{t('severityLevel.moderate')}</SelectItem>
									<SelectItem value="major">{t('severityLevel.major')}</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
								Description
							</Label>
							<Textarea
								id="description"
								rows={3}
								placeholder="Détails supplémentaires..."
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="imageUrl" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
								URL de l'image (Optionnel)
							</Label>
							<div className="relative">
								<Input
									id="imageUrl"
									type="url"
									placeholder="https://..."
									value={imageUrl}
									onChange={(e) => setImageUrl(e.target.value)}
									className="pl-9"
								/>
								<ImagePlus className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2 pt-2">
						<Button type="button" variant="outline" className="flex-1" onClick={() => setNewLocation(null)}>
							Annuler
						</Button>
						<Button
							type="submit"
							disabled={isLoading}
							className="flex-1 bg-sky-600 font-bold text-white hover:bg-sky-700"
						>
							<Send className="mr-2 h-4 w-4" />
							Publier
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
}
