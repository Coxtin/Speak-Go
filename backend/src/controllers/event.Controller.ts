import { Response, Request } from "express";
import * as eventService from '../services/event.service';

export const fetchEvents = async(req: Request, res: Response) => {

    try {

        const response = await eventService.fetchDataBaseForEvents();

        if (response.value === true && response.events){
            const firstEvent = response.events[0];
            console.log(
                "[fetchEvents] Primul eveniment chei:",
                firstEvent ? Object.keys(firstEvent) : "N/A"
            );
            console.log("[fetchEvents] Primul eveniment ticketTypes:", firstEvent?.ticketTypes);

            return res.status(200).json({events: response.events})

        }

        return res.status(404).json({message: "Nu exista evenimente disponibile"});

    } catch (error: any){
        console.error("Eroare la incarcarea evenimentelor: ", error);
        return res.status(401).json({message: "Nu s-au putut incarca evenimentele! Va rugam, incercati mai tarziu!"});
    }

}
