import OpenAI from "openai";
import { getEventSearchPrompt } from "../prompts/systemPrompts";
import { ChatCompletionMessageParam } from "openai/resources.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
})

export const processUserCommand = async (conversationHistory: Array<ChatCompletionMessageParam>) => {

    try {
    console.log("[AI Service] conversationHistory length:", conversationHistory?.length ?? 0);
    console.log("[AI Service] last user message:", conversationHistory?.[conversationHistory.length - 1]);

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: 'system',
                content: await getEventSearchPrompt()
            },
            ...conversationHistory
        ],
        response_format: {type: "json_object"},
        temperature: 0
    });

    const rawResponse = completion.choices[0].message.content;
    console.log("[AI Service] raw OpenAI response:", rawResponse);

    if (!rawResponse){
        console.error("Nu am primit un raspuns de la serviciul de procesare: ");
        return {value: false, message: "Nu am primit un răspuns de la serviciul de procesare! Vă rugăm să încercați mai târziu!"};
    }

    const parsedJSON = JSON.parse(rawResponse);

    console.log("Ai-ul a identificat urmatoarele: ", parsedJSON);

    return { value: true, content:  parsedJSON};

    } catch (error: any){
        console.error("Eroare la intelegerea cererii: ", error);
        return { value: false, message: "Serviciul de procesare a comenzilor este indisponibil!" };
    }

}

export const TTS = async (command: string) => {

    try {

       const mp3 = await openai.audio.speech.create({
            model: 'gpt-4o-mini-tts',
            voice: 'alloy',
            input: command
       });

       const buffer = Buffer.from(await mp3.arrayBuffer());

       return {value: true, audioBuffer: buffer};

    } catch (error: any){
        console.error("Eroare: ", error);
        return {value: false, message: "Nu am putut genera vocea"};
    }

}
