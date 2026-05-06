import { apiFetch } from "./apiClient";

export const transferCommand = async (command: string) => {

    try {

        const response = await apiFetch('/ai', {
            method: 'POST',
            body: JSON.stringify({ command })
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
