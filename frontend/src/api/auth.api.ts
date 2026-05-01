import { SignUpFormValues, LoginFormValues, ResetPasswordValues, InsertResetCodeValues, ModifyPasswordValues } from "../schemas/auth.schema";
import { BASE_URL } from "../../config/config";

const AUTH_BASE_URL = `${BASE_URL}/api/auth`;

const parseJsonSafely = async (response: Response) => {
    try {
        return await response.json();
    } catch {
        return null;
    }
};

export const registerUser = async (userData: SignUpFormValues) => {

    console.log(`${AUTH_BASE_URL}/register`);

    try{

        const response = await fetch(`${AUTH_BASE_URL}/register`, {
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

    console.log(`${AUTH_BASE_URL}/login`);

    try {

        const response = await fetch(`${AUTH_BASE_URL}/login`, {
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

export const sendResetCode = async (userData: ResetPasswordValues) => {

    try {

        const response = await fetch(`${AUTH_BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(userData)
        })

        const data = await parseJsonSafely(response);

        if (!response.ok){
            const errorMessage = data?.error || data?.message || "A aparut o eroare la trimiterea codului de resetare.";
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        return data;

    } catch (error: any){

        console.error ("Eroare la trimiterea cererii: ", error);
        throw error;

    }

}

export const verifyResetCode = async (payload: VerifyCodePayload) => {

    try {

        const response = await fetch (`${AUTH_BASE_URL}/verify-reset-code`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(payload)
        })

        const data = await parseJsonSafely(response);

        if (!response.ok) {

            const errorMessage = data?.error || data?.message || "A aparut o eroare la verificare codului!";
            console.error(errorMessage);
            throw new Error(errorMessage);

        }

        return data;

    } catch (error: any) {

        console.error("Eroare la verificare codului: ", error);
        throw error;

    }

}

export const modifyPassword = async (payload: ModifyPasswordPayload) => {

    try {

        const response = await fetch (`${AUTH_BASE_URL}/modify-password`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${payload.token}`
            },
            body: JSON.stringify({ password: payload.newPassword })
        })

        const data = await parseJsonSafely(response);

        if (!response.ok){

            const errorMessage = data?.error || data?.message || "A aparut o eroare la modificarea parolei!";
            console.error(errorMessage);
            throw new Error(errorMessage);

        }

        return data;

    } catch (error: any){

        console.error("A aparut o eroare la modificarea parolei: ", error);
        throw error;

    }

}

export interface VerifyCodePayload {
    email: string;
    code: string;
}

export interface ModifyPasswordPayload {
    newPassword: string,
    token: string
}
