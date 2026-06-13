import { useState, useEffect } from 'react';
import { fetchEventTickets } from '../api/tickets.api';
import { EventTicketResponse } from '../types/TicketInfo';

export const useTickets = (eventId: number) => {

    const [ticket, setTicket] = useState<EventTicketResponse | null>(null);
    const [availableSeats, setAvailableSeats] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const loadTickets = async () => {
            try {

                const data = await fetchEventTickets(eventId);
                setAvailableSeats(data.ticketInfo.availableSeats);
                setTicket(data);
                
            } catch (error) {

                console.error(error);

            } finally {
                setIsLoading(false);
            }
        };

        if (eventId)
            loadTickets();

    }, [eventId])

    return {
        ticket, availableSeats, isLoading
    }

}