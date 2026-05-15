import { Response, Request } from "express";
import * as eventService from '../services/event.service';

export const fetchEvents = async(req: Request, res: Response) => {

    try {

        const response = await eventService.fetchDataBaseForEvents();

        if (response.value === true && response.events){

            return res.status(200).json({events: response.events})

        }

        return res.status(404).json({message: "Nu exista evenimente disponibile"});

    } catch (error: any){
        console.error("Eroare la incarcarea evenimentelor: ", error);
        return res.status(401).json({message: "Nu s-au putut incarca evenimentele! Va rugam, incercati mai tarziu!"});
    }

}