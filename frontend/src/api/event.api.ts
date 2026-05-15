// import { apiFetch } from "./apiClient";
import { apiFetch } from "./apiClient";
import { EventParams } from "../types/eventParams";

export const getAllEvents = async () => {

    try {

        // const events : EventParams[] = await apiFetch("/events", {
        //     method: 'POST'
        // }) 

        

    } catch (error: any){
        console.error("Eroare la preluarea evenimentelor!");
        throw error;
    }

}