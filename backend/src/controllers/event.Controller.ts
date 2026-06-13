import { Response, Request, response } from "express";
import * as eventService from '../services/event.service';
import { getEventTicketDetails } from "../services/ticket.service";

export const fetchEvents = async(req: Request, res: Response) => {

    try {

        const response = await eventService.fetchDataBaseForEvents();

        if (response.value === true && response.events){
            const firstEvent = response.events[0];
            // console.log(
            //     "[fetchEvents] Primul eveniment chei:",
            //     firstEvent ? Object.keys(firstEvent) : "N/A"
            // );
            //console.log("[fetchEvents] Primul eveniment ticketTypes:", firstEvent?.ticketTypes);

            return res.status(200).json({events: response.events})

        }

        return res.status(404).json({message: "Nu exista evenimente disponibile"});

    } catch (error: any){
        console.error("Eroare la incarcarea evenimentelor: ", error);
        return res.status(401).json({message: "Nu s-au putut incarca evenimentele! Va rugam, incercati mai tarziu!"});
    }

}

export const searchEvent = async (req: Request, res: Response) => {

    try {

        const { filters } = req.body;

        console.log("Filtrele primite: ", filters);

        const response = await eventService.searchEventsByFilters(filters);

        if (response?.value === false && response?.events === null){

            return res.status(404).json({message: "Nu exista evenimente care sa corespunda cautarii dvs."});

        } else if (response?.value === false && response.message){

            return res.status(501).json({ message: response.message })

        } else {

            console.log("Trimit evenimentele gasite dupa filtre...");

            console.log("Trimit inapoi", response.filteredEvents);

            return res.status(200).json({message: "Evenimente care corespund cautarii dvs.", events: response.filteredEvents})
        }
    } catch (error: any){

        console.error("Eroare la cautarea evenimentelor: ", error);
        return res.status(401).json({message: "Nu am putut filtra evenimentele! Va rugam, incercati mai tarziu!"});

    }

}

export const fetchTicketsForEvents = async (req: Request, res: Response) => {

    try {

        const eventId = parseInt(req.params.id, 10);

        if (isNaN(eventId)){
            return res.status(400).json({message: "ID-ul evenimentului trebuie sa fie un numar valid!"});
        }

        const response = await getEventTicketDetails(eventId);

        if (response.value === false){
            return res.status(500).json({message: response.message})
        }

        return res.status(200).json({ticketInfo: response.ticketInfo});

    } catch (error: any) {
        
        console.error("Eroare la returnarea biletelor: ", error);

        if (error.message === "A aparut o problema la identificarea evenimentului!")
            return res.status(401).json({message: error.message});
        else
            return res.status(500).json({message: "Eroare interna a server-ului"});
    }

}
