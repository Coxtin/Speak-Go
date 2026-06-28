import { Response, Request, response } from "express";
import * as eventService from '../services/event.service';
import { getEventTicketDetails } from "../services/ticket.service";

export const fetchEvents = async(req: Request, res: Response) => {

    console.log("[DEBUG]: Cerere primită pentru fetchEvents");

    try {

        const userId = parseInt(res.locals.user?.userId);

        const response = await eventService.fetchDataBaseForEvents(userId);

        if (response.value === true && response.events){
            console.log(`[DEBUG]: S-au găsit ${response.events.length} evenimente`);
            return res.status(200).json({events: response.events})

        }

        console.log("[DEBUG]: Nu s-au găsit evenimente în DB");
        return res.status(404).json({message: "Nu există evenimente disponibile"});

    } catch (error: any){
        console.error("[DEBUG]: Eroare la incarcarea evenimentelor: ", error);
        return res.status(500).json({message: "Nu s-au putut încărca evenimentele! Vă rugăm să încercați mai târziu!"});
    }

}


export const searchEvent = async (req: Request, res: Response) => {

    try {

        const { filters } = req.body;

        console.log("Filtrele primite: ", filters);

        const response = await eventService.searchEventsByFilters(filters);

        if (response?.value === false && response?.events === null){

            return res.status(404).json({message: "Nu există evenimente care să corespundă căutării dvs. !"});

        } else if (response?.value === false && response.message){

            return res.status(501).json({ message: response.message })

        } else {

            console.log("Trimit evenimentele gasite dupa filtre...");

            console.log("Trimit inapoi", response.filteredEvents);

            return res.status(200).json({message: "Evenimente care corespund căutării dvs.", events: response.filteredEvents})
        }
    } catch (error: any){

        console.error("Eroare la cautarea evenimentelor: ", error);
        return res.status(401).json({message: "Nu am putut filtra evenimentele! Vă rugăm să încercați mai târziu!"});

    }

}

export const fetchTicketsForEvents = async (req: Request, res: Response) => {

    try {

        const eventId = parseInt(req.params.id, 10);

        if (isNaN(eventId)){
            return res.status(400).json({message: "ID-ul evenimentului trebuie să fie un număr valid!"});
        }

        const response = await getEventTicketDetails(eventId);

        if (response.value === false){
            return res.status(500).json({message: response.message})
        }

        return res.status(200).json({ticketInfo: response.ticketInfo});

    } catch (error: any) {
        
        console.error("Eroare la returnarea biletelor: ", error);

        if (error.message === "A aparut o problemă la identificarea evenimentului!")
            return res.status(401).json({message: error.message});
        else
            return res.status(500).json({message: "Eroare internă a serverului"});
    }

}

export const insertFeedback = async (req: Request, res: Response) => {

    try {
        console.log("\n--- [CONTROLLER insertFeedback] START ---");
        const { eventId, text, rating } = req.body;
        
        console.log(`[CONTROLLER insertFeedback] Parametri primiti din body: eventId=${eventId}, rating=${rating}, text=${text}`);
        
        const userId = parseInt(res.locals.user?.userId);
        console.log(`[CONTROLLER insertFeedback] User ID extras din token: ${userId}`);

        if (isNaN(userId)) {
            console.error("[CONTROLLER insertFeedback] Eroare: User ID este NaN. Probabil tokenul este invalid.");
            return res.status(401).json({ message: "Utilizator neautentificat sau ID invalid." });
        }

        const response = await eventService.addReviewToEvent(userId, eventId, text, rating);
        console.log(`[CONTROLLER insertFeedback] Raspuns de la service:`, response);

        if (response?.value === false){
            return res.status(400).json({ message: response?.message });
        } else {
            return res.status(200).json({ message: "Review adăugat cu succes!" });
        }

    } catch (error: any){
        console.error("[CONTROLLER insertFeedback] Eroare la salvarea recenziei: ", error);
        return res.status(500).json({ message: "Eroare internă" })
    }

}
