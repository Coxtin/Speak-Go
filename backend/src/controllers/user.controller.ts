import { Request, Response } from "express";
import { updateUserPassword } from "../services/user.service";

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

        return res.status(200).json({ message: "Parola dvs. a fost actualizata cu succes!" });

    } catch (error: any){
        console.error("Eroare la actualizarea parolei in baza de date: ", error);
        return res.status(500).json({ message: "Eroare interna a serverului!" });
    }

}