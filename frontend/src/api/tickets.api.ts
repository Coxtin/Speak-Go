import { apiFetch } from './apiClient';
import { EventTicketResponse } from '../types/TicketInfo';

export const fetchEventTickets = async (eventId: number): Promise<EventTicketResponse> => {

    try{

        const response = await apiFetch(`/events/${eventId}/ticket`, {
            method: "GET"
        });

        if (!response.ok){

            throw new Error("Eroare la prelurea datelor despre biletele disponibile");

        }

        return await response.json();
    
    } catch (error: any){
        console.error("Eroare la preluarea datelor despre bilete: ", error);
        throw error;
    }


}
