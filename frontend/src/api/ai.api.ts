import { apiFetch } from "./apiClient";
import { ChatCompletionMessageParam } from "../types/chatCompletionMessageParam";

export const transferCommand = async (intent: ChatCompletionMessageParam[]) => {

    try {

        const response = await apiFetch('/ai', {
            method: 'POST',
            body: JSON.stringify({ intent })
        });

        const data = await response.json().catch(() => null);

        if (!response.ok){
            throw new Error(data?.message || data?.error || "Nu am putut prelua rezultatul de la AI");
        }

        return data;

    } catch (error: any){
        console.error(error);
        throw error;
    }

}

