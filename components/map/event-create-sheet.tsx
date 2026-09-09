'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useEventStore } from '@/stores/event.store';
import { useAuthStore } from '@/stores/use-auth-store';
import { CreateEventInput, createEventSchema, EventSeverity } from '@/types/event.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, MapPin, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMapContext } from './map-provider';

export function EventCreateSheet() {
	const t = useTranslations('EventCreateSheet');
	const { isCreatingEvent, newLocation, setNewLocation } = useMapContext();
	const { user, token } = useAuthStore();
	const { createEvent, isLoading } = useEventStore();

	const [formError, setFormError] = useState<string | null>(null);
	const [formSuccess, setFormSuccess] = useState<string | null>(null);

	const form = useForm<CreateEventInput>({
		resolver: zodResolver(createEventSchema),
		defaultValues: {
			title: '',
			description: '',
			address: '',
			eventCategoryId: '',
			severity: EventSeverity.LOW,
			latitude: 0,
			longitude: 0,
		},
	});

	// Synchroniser les coordonnées cliquées sur la carte avec React Hook Form
	useEffect(() => {
		if (newLocation) {
			form.setValue('latitude', newLocation.lat);
			form.setValue('longitude', newLocation.lng);
			// Exemple : pré-remplir l'adresse sous forme textuelle si souhaité
			form.setValue('address', `${newLocation.lat.toFixed(5)}, ${newLocation.lng.toFixed(5)}`);
		}
	}, [newLocation, form]);

	const onSubmit = async (data: CreateEventInput) => {
		if (!newLocation || !user) {
			setFormError('Coordonnées manquantes ou utilisateur non authentifié.');
			return;
		}
		setFormError(null);
		setFormSuccess(null);

		try {
			await createEvent(data, token!);
			setFormSuccess('Signalement publié avec succès !');

			// Réinitialiser le formulaire et fermer la sheet après 1.5s
			setTimeout(() => {
				form.reset();
				setNewLocation(null);
				setFormSuccess(null);
			}, 1500);
		} catch (err: any) {
			setFormError(err.message || 'Une erreur est survenue lors de la création.');
		}
	};

	return (
		<Sheet
			open={!!isCreatingEvent}
			onOpenChange={(open) => {
				if (!open) {
					setNewLocation(null);
					setFormError(null);
					setFormSuccess(null);
				}
			}}
			modal={false}
		>
			<SheetContent
				side="right"
				className="pointer-events-auto w-full overflow-y-auto p-0 sm:max-w-md"
				hideOverlay={true}
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

					{formError && (
						<div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
							<AlertCircle className="h-4 w-4 shrink-0" />
							<span>{formError}</span>
						</div>
					)}

					{formSuccess && (
						<div className="flex items-center gap-2 rounded-lg bg-emerald-500/15 p-3 text-sm text-emerald-600">
							<CheckCircle2 className="h-4 w-4 shrink-0" />
							<span>{formSuccess}</span>
						</div>
					)}

					<div className="space-y-4">
						<div className="space-y-1">
							<Label htmlFor="title" className="text-xs font-bold text-muted-foreground uppercase">
								Titre du signalement *
							</Label>
							<Input id="title" placeholder="ex: Travaux, Accident..." {...form.register('title')} />
							{form.formState.errors.title && (
								<p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
							)}
						</div>

						<div className="space-y-1">
							<Label htmlFor="eventCategoryId" className="text-xs font-bold text-muted-foreground uppercase">
								Catégorie *
							</Label>
							<Controller
								control={form.control}
								name="eventCategoryId"
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger id="eventCategoryId">
											<SelectValue placeholder="Sélectionner une catégorie" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="cat_accident_01">Accident</SelectItem>
											<SelectItem value="cat_traffic_02">Embouteillage</SelectItem>
											<SelectItem value="cat_hazard_04">Danger / Obstacle</SelectItem>
											<SelectItem value="cat_police_03">Contrôle de police</SelectItem>
											<SelectItem value="cat_closure_05">Route fermée</SelectItem>
											<SelectItem value="cat_other_06">Autre</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{form.formState.errors.eventCategoryId && (
								<p className="text-xs text-destructive">{form.formState.errors.eventCategoryId.message}</p>
							)}
						</div>

						<div className="space-y-1">
							<Label htmlFor="severity" className="text-xs font-bold text-muted-foreground uppercase">
								Niveau de sévérité *
							</Label>
							<Controller
								control={form.control}
								name="severity"
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger id="severity">
											<SelectValue placeholder="Sélectionner la sévérité" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={EventSeverity.LOW}>Faible (LOW)</SelectItem>
											<SelectItem value={EventSeverity.MEDIUM}>Moyenne (MEDIUM)</SelectItem>
											<SelectItem value={EventSeverity.HIGH}>Élevée (HIGH)</SelectItem>
											<SelectItem value={EventSeverity.CRITICAL}>Critique (CRITICAL)</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{form.formState.errors.severity && (
								<p className="text-xs text-destructive">{form.formState.errors.severity.message}</p>
							)}
						</div>

						<div className="space-y-1">
							<Label htmlFor="address" className="text-xs font-bold text-muted-foreground uppercase">
								Adresse / Lieu approximatif *
							</Label>
							<Input id="address" placeholder="ex: Rue du Commerce, Antananarivo" {...form.register('address')} />
							{form.formState.errors.address && (
								<p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
							)}
						</div>

						<div className="space-y-1">
							<Label htmlFor="description" className="text-xs font-bold text-muted-foreground uppercase">
								Description détaillée *
							</Label>
							<Textarea
								id="description"
								rows={3}
								placeholder="Détails supplémentaires sur le signalement..."
								{...form.register('description')}
							/>
							{form.formState.errors.description && (
								<p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
							)}
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
							{isLoading ? 'Envoi...' : 'Publier'}
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
}
