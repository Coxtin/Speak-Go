import { Request, Response } from "express";
import * as paymentService from "../services/payment.service";
import { CreatePaymentRequest } from "../types/payment.types";

export const makePayment = async (req: Request, res: Response) => {

    try {

        const userId = res.locals.user?.userId ? parseInt(res.locals.user.userId, 10) : null;

        if (!userId){
            console.error("Eroare la preluarea id-ului utilizatorului!");
            return res.status(401).json({message: "Utilizator neidentificat!"});
        }

        const {eventId, selectedTickets} = req.body as CreatePaymentRequest;

        if (!eventId || !selectedTickets || selectedTickets.length === 0){

            return res.status(400).json({message: "Lipsesc datele biletului! "});

        }

        const response = await paymentService.createPaymentIntent(userId, eventId, selectedTickets);

        if (response?.value === false)
            return res.status(400).json({message: response.message})

        return res.status(200).json({ client_secret: response?.data, bookingId: response?.bookingId })

    } catch (error: any){

        if (error.message && error.message.startsWith("NOT_FOUND:"))
            return res.status(404).json({message: error.message})
        else
            return res.status(500).json({message: "Eroare interna a serverului la citirea datelor biletelor!"});
    }

}

export const bookTicket = async (req: Request, res: Response) => {

    try {

        const { bookingId } = req.body;

        const userId = res.locals.user?.userId ? parseInt(res.locals.user.userId, 10) : null;

        if (!userId){
            console.error("Eroare la preluarea id-ului utilizatorului!");
            return res.status(401).json({message: "Utilizator neidentificat!"});
        }

        if (!bookingId){
            console.error("Nu a fost gasit bookingId!");
            return res.status(404).json({message: "Nu a fost gasit id-ul biletului!"});
        }

        const response = await paymentService.confirmPaymentAndGenerateTickets(userId, bookingId);

        if (response.value === false){
            console.error("Eroare la confirmarea platii: ", response.message);
            return res.status(400).json({ message: response.message });
        }

        return res.status(200).json({ message: response.message });

    } catch (error: any){
        
        console.error("Eroar la confirmarea platii: ", error);
        return res.status(500).json({message: "Eroare interna a server-ului!"});

    }

}