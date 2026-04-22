import { Response, Request } from 'express';
import * as authService from '../services/auth.service';

const EMAIL_ALREADY_EXISTS_ERROR = "Exista deja un cont cu acest email!";
const INVALID_CREDENTIALS_ERROR = "Email sau parola incorecta!";

export const register = async (req: Request, res: Response) => {
    
    // console.log("Am intrat la controller");

    try {

        const createdUser = await authService.registerNewUser(req.body);
        return res.status(201).json({message: "Cont creat cu succes", user: createdUser});

    } catch (error:any){
        console.error("Eroare la inregistrare:", error);

        if (error.message === EMAIL_ALREADY_EXISTS_ERROR)
            return res.status(409).json({error: error.message});

        return res.status(500).json({error: "A aparut o eroare neasteptata."});
    }
};

export const login = async (req: Request, res: Response) => {

    try{

        const loginData = await authService.loginUser(req.body);

        return res.status(200).json({message: "Autentificare reusita!", data: loginData});
    } catch (error : any){

        if (error.message === INVALID_CREDENTIALS_ERROR)
            return res.status(401).json({error: error.message })

        return res.status(500).json({error: "A aparut o eroare neasteptata."});

    }

};

export const refreshAccesToken = async (req: Request, res: Response) => {

    try {

        const { token } = req.body;

        if (!token)
            return res.status(401).json({error: "Lipseste refresh token-ul!"});

        const result = await authService.refreshAccesToken(token);

        return res.status(200).json(result);
    
    } catch(error: any){

        console.error("Refresh Token-ul este expirat! Necesita relogarea utilizatorului!");
        return res.status(403).json({error: error.message});

    }
};
