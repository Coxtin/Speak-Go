import OpenAI from "openai";
import { getEventSearchPrompt } from "../prompts/systemPrompts";
import { prisma } from "../config/db";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
})

export const processUserCommand = async (command: string) => {

    try {

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: 'system',
                content: getEventSearchPrompt()
            },
            {
                role: 'user',
                content: command
            }
        ],
        response_format: {type: "json_object"},
        temperature: 0
    });

    const rawResponse = completion.choices[0].message.content;

    if (!rawResponse){
        console.error("Nu am primit un raspuns de la serviciul de procesare: ");
        return {value: false, message: "Nu am primit un raspuns de la serviciul de procesare! Va rugam incercari mai tarziu"};
    }

    const parsedJSON = JSON.parse(rawResponse);

    console.log("Ai-ul a identificat urmatoarele: ", parsedJSON);

    return { value: true, content:  parsedJSON};

    } catch (error: any){
        console.error("Eroare la intelegerea cererii: ", error);
        return { value: false, message: "Serviciul de procesare a comenzilor este indisponibil!" };
    }

}