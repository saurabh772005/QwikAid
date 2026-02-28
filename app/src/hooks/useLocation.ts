import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useEmergencyStore, useAuthStore } from '@/stores';

export const useLocation = () => {
    const { setUserLocation, caseId } = useEmergencyStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by this browser.');
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const location = { lat: latitude, lng: longitude, areaName: 'Locating...' };
                setUserLocation(location);

                if (socket.connected) {
                    socket.emit('location_update', { 
                        lat: latitude, 
                        lng: longitude,
                        case_id: caseId,
                        user_id: user?.id 
                    });
                }

                // Reverse geocode to get area name
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
                    headers: { 'User-Agent': 'QwikAid/1.0' }
                })
                    .then(res => res.json())
                    .then(data => {
                        const areaName = data.address?.suburb || data.address?.city || data.address?.town || data.address?.state || 'Unknown Location';
                        setUserLocation({ lat: latitude, lng: longitude, areaName });
                    })
                    .catch(err => {
                        console.error('Reverse geocode error:', err);
                        setUserLocation({ lat: latitude, lng: longitude });
                    });
            },
            (error) => {
                console.error('Geolocation error:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [setUserLocation, caseId, user?.id]);
};
