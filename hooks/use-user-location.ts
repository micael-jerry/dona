'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserLocationState } from '@/types/map';

/**
 * useUserLocation
 *
 * Custom hook that tracks the user's GPS location in real time using navigator.geolocation.watchPosition.
 * Automatically handles position updates, accuracy, error handling, and lifecycle cleanup.
 */
export function useUserLocation() {
	const [locationState, setLocationState] = useState<UserLocationState>(() => {
		const isSupported = typeof window !== 'undefined' && 'geolocation' in navigator;
		return {
			coords: null,
			accuracy: undefined,
			heading: null,
			speed: null,
			isTracking: isSupported,
			error: isSupported ? null : 'La géolocalisation n’est pas supportée par votre navigateur.',
		};
	});

	useEffect(() => {
		if (typeof window === 'undefined' || !('geolocation' in navigator)) {
			return;
		}

		const watchId = navigator.geolocation.watchPosition(
			(position) => {
				setLocationState({
					coords: {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					},
					accuracy: position.coords.accuracy,
					heading: position.coords.heading,
					speed: position.coords.speed,
					isTracking: true,
					error: null,
				});
			},
			(err) => {
				let errorMessage = 'Impossible d’accéder à votre position GPS.';
				if (err.code === err.PERMISSION_DENIED) {
					errorMessage = 'Permission de géolocalisation refusée.';
				} else if (err.code === err.TIMEOUT) {
					errorMessage = 'Délai d’attente de la géolocalisation dépassé.';
				}

				setLocationState((prev) => ({
					...prev,
					isTracking: false,
					error: errorMessage,
				}));
			},
			{
				enableHighAccuracy: true,
				timeout: 15000,
				maximumAge: 2000,
			},
		);

		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, []);

	const requestLocation = useCallback(() => {
		if (!('geolocation' in navigator)) return;

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocationState({
					coords: {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					},
					accuracy: position.coords.accuracy,
					heading: position.coords.heading,
					speed: position.coords.speed,
					isTracking: true,
					error: null,
				});
			},
			(err) => {
				setLocationState((prev) => ({
					...prev,
					error: err.message,
				}));
			},
			{ enableHighAccuracy: true, timeout: 10000 },
		);
	}, []);

	return { ...locationState, requestLocation };
}
