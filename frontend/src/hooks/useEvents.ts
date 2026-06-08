import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api/apiClient';
import { EventParams } from '../types/eventParams';
import { EventFilter } from '../types/EventFilter';
import { BASE_URL } from '../../config/config';

export const useEvents = () => {

    const [events, setEvents] = useState<EventParams[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {

        try {

            setIsLoading(true);
            setError(null);
            //console.log('[useEvents] Endpoint:', `${BASE_URL}/api/events`);

            const response = await apiFetch('/events');

            if (!response.ok) {
                throw new Error('Nu am putut prelua evenimentele!');
            }

            const data: { events: EventParams[] } = await response.json();
            //const firstEvent = data.events?.[0];
            //console.log('[useEvents] Primul eveniment chei:', firstEvent ? Object.keys(firstEvent) : 'N/A');
            //console.log('[useEvents] Primul eveniment ticketTypes:', firstEvent?.ticketTypes);
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

    const fetchFilteredEvents = async (filters: EventFilter) => {

        try {

            console.log("Am intrat in functia de cautare dupa filtre!");

            setIsLoading(true);
            setError("");

            const response = await apiFetch('/events/search', {
                method: 'POST',
                body: JSON.stringify({ filters: filters })
            });
            
            console.log("Am trimis filtrele!");

            if (response.status === 404){
                setEvents([]);
                setIsLoading(false);
                return;
            }

            if (!response.ok){
                throw new Error("Eroare la aducerea evenimentelor filtrate");
            }
            
            console.log("Setez noile evenimente...");

            const filteredEvents: { events: EventParams[] } = await response.json();
            setEvents(filteredEvents.events ?? []);

        } catch (error: unknown){

              const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Eroare la preluarea evenimentelor din baza de date.';

            console.error('Eroare la prelucrarea evenimentelor filtrate din baza de date: ', error);
            setError(errorMessage);

        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return {
        events,
        isLoading,
        error,
        fetchFilteredEvents,
        refresh: fetchEvents,
}

}

