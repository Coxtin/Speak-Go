import { Response, Request } from 'express';

import * as voiceService from '../services/voice.service'

export const handleVoiceCommands = async (req: Request, res: Response) => {

    try {

       if (!req.file) {

        return res.status(400).json({error: "Nu am primit calea catre fisier!"});

       }

       const filePath = req.file.path;

       const text = await voiceService.transcribeAudio(filePath);

       return res.status(200).json({text});

    } catch (error : any){

        console.error("Am primit eroare la apelarea functiilor: ", error);
        return res.status(500).json({error: error.message});

    }

}
