import fs from 'fs';
import OpenAI from 'openai';

export const transcribeAudio = async (filePath: string) => {

    if (!filePath) {

        console.error("Nu a fost gasita calea catre fisierul audio!");
        throw new Error("Nu a fost gasita calea catre fisierul audio");

    }

    try {

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_SECRET_KEY
        });

        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model:'whisper-1',
            language: 'ro'
        });

        const transcribedText = response.text;
        
        return transcribedText;

    } catch (error: any){

        console.error("Eroare la transformarea fisierului audio in text: ", error);
        throw new Error(`Eroare la transformarea fisierului audio in text: ${error}`);

    }

}