import { Response, Request } from 'express';
import * as authService from '../services/register.auth';

export const register = async (req: Request, res: Response) => {
    
    console.log("Am intrat la controller");

    try {

        const createdUser = await authService.registerNewUser(req.body);
        return res.status(201).json({message: "Cont creat cu succes", user: createdUser})

    } catch (error:any){
        console.error("Am mai primit o eroare: ", error);
        return res.status(400).json({error: error.message})
    }
}