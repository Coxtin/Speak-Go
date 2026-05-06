import { BASE_URL } from "../../config/config";
import { apiFetch } from "./apiClient";

const parseJsonSafely = async (response: Response) => {
    try {
        return await response.json();
    } catch {
        return null;
    }
};

export const transferCommand = async (command: string) => {

    try {

        const response = await apiFetch('/ai', {
            method: 'POST',
            body: command
        });

        const data = await response.json().catch(() => null);

        if (!response.ok){
            throw new Error(data?.message || "Nu am putut prelua rezultatul de la AI");
        }

        return data;

    } catch (error: any){
        console.error(error);
        throw error;
    }

}