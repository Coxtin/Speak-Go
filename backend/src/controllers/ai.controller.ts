import { Response, Request } from "express";
import * as aiService from '../services/ai.service';

export const convertText2Intent = async (req: Request, res: Response) => {

    try {
        const { intent } = req.body;

        const aiResult = await aiService.processUserCommand(intent);

        if (!aiResult.value)
            return res.status(500).json({ message: aiResult.message });

        const data = aiResult.content;

        if (data.intent === "greeting") {
            const replyMessage = data.reply_message || data.intent_message;
            return res.status(200).json({ action: "speak", message: replyMessage });
        }

        else if (data.intent === "need_more_info"){
            const replyMessage = data.reply_message || data.intent_message;
            return res.status(200).json({action: "ask_for_info", message: replyMessage})
        }

        else if (data.intent === "search_events")
            return res.status(200).json({action: "search_event", message: data.parameters});

        return res.status(400).json({action: "no_action", message: "Intent necunoscut primit de la AI." });

    } catch (error: any){
        console.error("Eroare de la ai.service: ", error);
        return res.status(401).json({ message: error?.message || "Eroare la procesarea cererii AI." });
    }
}

export const convertTTS = async (req: Request, res: Response) => {

    try {
    
        const { message } = req.body;

        const aiResult = await aiService.TTS(message);

        if (aiResult.value == true && aiResult.audioBuffer){
            res.set({
                'Content-Type' : 'audio/mpeg',
                'Content-Length' : aiResult.audioBuffer.length
            });

            res.send(aiResult.audioBuffer);

        } else if (aiResult.value === false || !aiResult.audioBuffer){
            return res.status(500).json({error: aiResult.message});
        }

    } catch (error: any) {
        console.error("Eroare la trimiterea cererii de generare a vocii: ", error);
        return res.status(401).json({message: error?.message || "Eroare la trimiterea cererii!"});
    }

}