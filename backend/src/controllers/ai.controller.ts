import { Response, Request } from "express";
import * as aiService from '../services/ai.service';

export const convertText2Intent = async (req: Request, res: Response) => {

    try {
        const { command } = req.body;

        const aiResult = await aiService.processUserCommand(command);

        if (!aiResult.value)
            return res.status(500).json({error: aiResult.message});

        const data = aiResult.content;

        if (data.intent === "greeting" || data.intent === "need_more_info")
            return res.status(200).json({action: "speak", message: data.intent_message});

        else if (data.intent === "search_events")
            return res.status(200).json({action: "search_event", message: data.parameters});

    } catch (error: any){
        console.error("Eroare de la ai.service: ", error);
        return res.status(401).json({error: error});
    }
}