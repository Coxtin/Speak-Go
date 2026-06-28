import { Request, Response } from "express";
import { updateUserPassword, returnInfoAboutUser } from "../services/user.service";

export const changePassword = async (req: Request, res: Response) => {

    try {

        const payload = req.body;

        const userId = parseInt(res.locals.user.userId);

        if (!userId){
            return res.status(400).json({ message: "Nu a fost identificat utilizatorul!" });
        }

        const response = await updateUserPassword(userId, payload);

        if (response.value === false){
            console.error(response?.message);
            return res.status(401).json({ message: response.message || "A aparut o eroare la actualizarea parolei!" });
        }

        return res.status(200).json({ message: "Parola dvs. a fost actualizată cu succes!" });

    } catch (error: any){
        console.error("Eroare la actualizarea parolei in baza de date: ", error);
        return res.status(500).json({ message: "Eroare internă a serverului!" });
    }

}

export const getUserData = async (req: Request, res: Response) => {

    try {

        const userId = res.locals.user?.userId ? parseInt(res.locals.user?.userId) : undefined;

        if (!userId)
            return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });

        const response = await returnInfoAboutUser(userId);

        if (response.value === false)
            return res.status(404).json({ message: response.message });

        return res.status(200).json({ createdAt: response.createdAt, totalTickets: response.ticketCount });
    } catch (error: any){
        console.error("Eroare la preluarea profilului: ", error);

        if (error === "Eroare la preluarea informaților utilizatorului!")
            return res.status(400).json({ message: error });
        else
            return res.status(500).json({ message: "Eroare internă a serverului!" });
    }

}