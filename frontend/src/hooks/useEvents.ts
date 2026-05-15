import { useState, useEffect } from 'react';

import { EventParams } from '../types/eventParams';


export const useEvents = () => {

    const [events, setEvents] = useState<EventParams[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = async() => {

        try {

            //const 

        } catch (error: any){
            console.error("Eroare la prelucrarea evenimentelor din baza de date: ", error);
            throw error;
        }

    }

}