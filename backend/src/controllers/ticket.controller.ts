import { Request, Response } from "express";
import { getUserTickets } from "../services/ticket.service";

export const fetchTickets = async (req: Request, res: Response) => {

    try {

        const userId = res.locals.user?.userId ? parseInt(res.locals.user.userId, 10) : null;

        if (!userId){
            console.error("Utilizator neidentificat");
            return res.status(401).json({ message: "Utilizator neidentificat!" });
        }

        const response = await getUserTickets(userId);

        return res.status(200).json({ tickets: response.tickets });

    } catch (error: any){

        console.error("Eroare in fetchTickets: ", error);
        return res.status(500).json({ message: "Eroare interna a serverului!" });

    }

}