import { SignUpFormValues, LoginFormValues } from "../schemas/auth.schema";

const BASE_URL = "http://192.168.1.133:5002/api/auth";

const parseJsonSafely = async (response: Response) => {
    try {
        return await response.json();
    } catch {
        return null;
    }
};

export const registerUser = async (userData: SignUpFormValues) => {

    console.log(`${BASE_URL}/register`);

    try{

        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(userData)
        })

        const data = await parseJsonSafely(response);

        if (!response.ok)
            throw new Error(data?.error || "A aparut o eroare la crearea contului.");

        return data;
    } catch (error){
        console.error("Eroare la inregistrare:", error);
        throw error;
    }
};

export const loginUser = async (credentials: LoginFormValues) => {

    console.log(`${BASE_URL}/login`);

    try {

        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(credentials)
        })

        const data = await parseJsonSafely(response);

        if (!response.ok){
            console.error("Eroare la raspunsul de autentificare de la server.");
            throw new Error(data?.error || "A aparut o eroare la autentificare.");
        }

        return data;

    } catch(error: any){
        console.error("Eroare la autentificare:", error);
        throw error;
    }

}
