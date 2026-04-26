/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { UserLocation } from '../types';

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const startWatching = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setError('Geolocation requires a secure connection (HTTPS).');
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);

    const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
    };

    const handleSuccess = (position: GeolocationPosition) => {
        setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        });
        setLoading(false);
        setError(null);
    };

    const handleError = (err: GeolocationPositionError) => {
        console.error('Geolocation error:', err);
        
        // If high accuracy failed, try falling back to low accuracy
        if (options.enableHighAccuracy && (err.code === err.TIMEOUT || err.code === err.POSITION_UNAVAILABLE)) {
            console.log('Falling back to low accuracy...');
            const lowAccOptions = { ...options, enableHighAccuracy: false };
            navigator.geolocation.getCurrentPosition(handleSuccess, (secondErr) => {
                setError(getErrorMessage(secondErr));
                setLoading(false);
            }, lowAccOptions);
            return;
        }

        setError(getErrorMessage(err));
        setLoading(false);
    };

    const getErrorMessage = (err: GeolocationPositionError) => {
        switch (err.code) {
            case err.PERMISSION_DENIED:
                return 'Please enable location permissions in your browser settings to find healthcare near you.';
            case err.POSITION_UNAVAILABLE:
                return 'Location information is unavailable. Please check your GPS signal.';
            case err.TIMEOUT:
                return 'Location request timed out. Please try again.';
            default:
                return err.message || 'An unknown error occurred while detecting location.';
        }
    };

    try {
        const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
        return watchId;
    } catch (e) {
        setError('Failed to start location tracking.');
        setLoading(false);
        return null;
    }
  };

  useEffect(() => {
    const watchId = startWatching();
    return () => {
        if (watchId !== null && typeof watchId === 'number') {
            navigator.geolocation.clearWatch(watchId);
        }
    };
  }, []);

  return { location, error, loading, refresh: startWatching };
}
