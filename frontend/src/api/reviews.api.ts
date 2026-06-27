import { apiFetch } from "./apiClient";

export const sendReview = async (eventId: number, text: string, rating: number) => {

    try {
        console.log(`[API sendReview] Trimit datele catre backend: eventId=${eventId}, rating=${rating}, text=${text}`);

        const response = await apiFetch('/events/review', {
            method: 'POST',
            body: JSON.stringify({
                eventId: eventId,
                text: text,
                rating: rating
            })
        })

        console.log(`[API sendReview] Status code primit de la backend: ${response.status}`);

        const data = await response.json().catch(() => null);
        console.log(`[API sendReview] Raspuns parsat JSON:`, data);

        if (!response.ok){
            throw new Error(data?.message || "Eroare la trimiterea review-ului");
        }

        return data;

    } catch (error: any){
        console.error("[API sendReview] Eroare in catch block: ", error);
        throw error;
    }

}