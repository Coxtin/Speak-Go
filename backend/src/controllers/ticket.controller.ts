import { Request, Response } from "express";
import { getUserTickets, deleteTicket } from "../services/ticket.service";

export const fetchTickets = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user?.userId ? parseInt(res.locals.user.userId, 10) : null;

        if (!userId) {
            console.error("Utilizator neidentificat");
            return res.status(401).json({ message: "Utilizator neidentificat!" });
        }

        const response = await getUserTickets(userId);
        return res.status(200).json({ tickets: response.tickets });
    } catch (error: any) {
        console.error("Eroare in fetchTickets: ", error);
        return res.status(500).json({ message: "Eroare interna a serverului!" });
    }
};

export const removeTicket = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user?.userId ? parseInt(res.locals.user.userId, 10) : null;
        const ticketId = parseInt(req.params.id, 10);

        if (!userId) {
            return res.status(401).json({ message: "Utilizator neidentificat!" });
        }

        if (isNaN(ticketId)) {
            return res.status(400).json({ message: "ID bilet invalid!" });
        }

        const result = await deleteTicket(ticketId, userId);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Eroare în removeTicket:", error);
        return res.status(500).json({ message: "Eroare internă a serverului!" });
    }
};
