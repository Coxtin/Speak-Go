import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api/apiClient';
import { EventParams } from '../types/eventParams';
import { BASE_URL } from '../../config/config';

export const useEvents = () => {

    const [events, setEvents] = useState<EventParams[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {

        try {

            setIsLoading(true);
            setError(null);
            console.log('[useEvents] Endpoint:', `${BASE_URL}/api/events`);

            const response = await apiFetch('/events');

            if (!response.ok) {
                throw new Error('Nu am putut prelua evenimentele!');
            }

            const data: { events: EventParams[] } = await response.json();
            const firstEvent = data.events?.[0];
            console.log('[useEvents] Primul eveniment chei:', firstEvent ? Object.keys(firstEvent) : 'N/A');
            console.log('[useEvents] Primul eveniment ticketTypes:', firstEvent?.ticketTypes);
            setEvents(data.events ?? []);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Eroare la preluarea evenimentelor din baza de date.';

            console.error('Eroare la prelucrarea evenimentelor din baza de date: ', error);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }

    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return {
        events,
        isLoading,
        error,
        refresh: fetchEvents,
}

}

