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


export interface ChangePasswordPayloads {
    oldPassword: string,
    newPassword: string,
    repeatNewPassword: string
}