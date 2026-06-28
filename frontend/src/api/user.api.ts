import { apiFetch } from "./apiClient";

export const modifyPassword = async (payload: ChangePasswordPayloads) => {

    try {

        const response = await apiFetch('/user/change-password', {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok){
            
            const errorMessage = data?.error || data?.message || "A aparut o problema la actualizarea parolei!";
            console.log("Eroare la actualizarea parolei:", errorMessage);
            throw new Error(errorMessage);
        }

        return data;

    } catch (error: any){
        console.error("Eroare la actualizarea parolei: ", error);
        throw error;
    }

}

export const getUserInfo = async () => {

    try {

        const response = await apiFetch('/user/me', {
            method: 'GET'
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error || data?.message || "A apărut o problemă la preluarea datelor utilizatorului!";
            console.log("Eroare la preluarea profilului:", errorMessage);
            throw new Error(errorMessage);
        }

        return data;

    } catch (error: any) {
        console.error("Eroare la preluarea informațiilor utilizatorului: ", error);
        throw error;
    }

}

export interface ChangePasswordPayloads {
    oldPassword: string,
    newPassword: string,
    repeatNewPassword: string
}