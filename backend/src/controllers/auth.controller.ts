import { Response, Request } from 'express';
import * as authService from '../services/auth.service';
//import { responseEncoding } from 'axios';

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

export const sendResetCode = async (req: Request, res: Response) => {

    try {

        const { email } = req.body;

        const result = await authService.sendResetCode(email);

        if (result.value === false)
            return res.status(result.status).json({error: result.message});
        
        return res.status(result.status).json({message: result.message});   

    } catch (error: any){
        console.error("A aparut o eroare la trimiterea cererii de resetare de parola", error);
        return res.status(500).json({error: error.message});
    }

}

export const checkResetCode = async (req: Request, res: Response) => {
    
    try {

        const { email, code } = req.body;

        const result = await authService.verifyResetCode(email, code);
        
        if (result?.value === false)
            return res.status(429).json({error: result.message});

        return res.status(200).json({message: result.message, token: result.token});

    } catch (error: any){
        console.error("A aparut o eroare la prelucrarea verificarii codului: ", error);
        return res.status(500).json({error: error.message});
    }

}

export const resetPassword = async (req: Request, res: Response) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({error: "Acces neautorizat!"});
        }

        const token = authHeader.split(' ')[1];

        const { password } = req.body;

        if (!password){
            return res.status(401).json({error: "Parola noua este obligatorie!"});
        }

        const result = await authService.modifyPassword(password, token);

        if (result.value === false)
            return res.status(result.status).json({error: result.message});

        return res.status(result.status).json({message: result.message});


    } catch (error: any) {

        console.error("Eroaer la controller-ul de modificare a parolei: ", error);
        return res.status(500).json({error: error});

    }

}

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

