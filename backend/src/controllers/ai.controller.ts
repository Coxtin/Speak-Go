import { Response, Request } from "express";
import * as aiService from '../services/ai.service';

export const convertText2Intent = async (req: Request, res: Response) => {

    try {
        const { command } = req.body;

        const aiResult = await aiService.processUserCommand(command);

        if (!aiResult.value)
            return res.status(500).json({ message: aiResult.message });

        const data = aiResult.content;

        if (data.intent === "greeting" || data.intent === "need_more_info") {
            const replyMessage = data.reply_message || data.intent_message;
            return res.status(200).json({ action: "speak", message: replyMessage });
        }

        else if (data.intent === "search_events")
            return res.status(200).json({action: "search_event", message: data.parameters});

        return res.status(400).json({ message: "Intent necunoscut primit de la AI." });

    } catch (error: any){
        console.error("Eroare de la ai.service: ", error);
        return res.status(401).json({ message: error?.message || "Eroare la procesarea cererii AI." });
    }
}
