import { SignUpFormValues } from "../schemas/auth.schema";

const BASE_URL = "http://192.168.1.133:5002/api";

export const registerUser = async (userData: SignUpFormValues) => {

    console.log(`${BASE_URL}/register`);

    try{

        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(userData)
        })

        const data = await response.json()

        if (!response.ok)
            throw new Error(data.error || "Something went wrong!");

        return data;
    } catch (error){
        console.error("Eroare: ", error);
        throw error;
    }
};