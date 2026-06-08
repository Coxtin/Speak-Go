import { apiFetch } from "./apiClient";
import { ChatCompletionMessageParam } from "../types/chatCompletionMessageParam";
import { File, Paths } from 'expo-file-system';


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

export const getAudio = async ( text: string ): Promise <string | null> => {

    try {

        if (!text) {
            throw new Error("Mesajul pentru conversia TTS este obligatoriu.");
        }

        const fileName = `ai_response_${Date.now()}.mp3`;
        const audioFile = new File(Paths.cache, fileName);

        const response = await apiFetch('/ai/tts', {
            method: 'POST',
            body: JSON.stringify({ message: text })
        });

        if (!response.ok){
            const errorBody = await response.json().catch(() => null);
            throw new Error(errorBody?.message || errorBody?.error || "Nu am putut genera vocea.");
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('audio/mpeg')) {
            throw new Error("Răspuns invalid: backend-ul nu a trimis un fișier MP3.");
        }

        const audioBuffer = await response.arrayBuffer();
        const audioBytes = new Uint8Array(audioBuffer);

        audioFile.create({ overwrite: true, intermediates: true });
        audioFile.write(audioBytes);

        if (!audioFile.exists){
            throw new Error("Eroare la salvarea fișierului audio.");
        }

        return audioFile.uri;

    } catch (error: any){
        console.error("Eroare la trimiterea cererii pentru voce: ", error);
        return null;
    }

}

