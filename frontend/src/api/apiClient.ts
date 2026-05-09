import * as secureStore from 'expo-secure-store';
import { BASE_URL } from '../../config/config';

const API_BASE_URL = `${BASE_URL}/api`;

export const apiFetch = async (endpoint: string, options: any = {}) => {

    const accessToken =
        (await secureStore.getItemAsync('accessToken')) ??
        (await secureStore.getItemAsync('accesToken'));
    const isFormDataBody = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const endpointUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const requestHeaders = {
        ...options.headers,
        ...(accessToken ? {'Authorization': `Bearer ${accessToken}`} : {}),
    };

    if (isFormDataBody) {
        delete requestHeaders['Content-Type'];
    } else if (!requestHeaders['Content-Type'])
        requestHeaders['Content-Type'] = 'application/json';

    const config = {
        ...options,
        headers: requestHeaders,
    };

    let response = await fetch(endpointUrl, config);

    if (response.status === 401){

        const refreshToken = await secureStore.getItemAsync('refreshToken');

        if (refreshToken){

            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({token: refreshToken})
            })

            if (refreshRes.ok){

                const { accessToken: newAccessToken } = await refreshRes.json();

                if (typeof newAccessToken !== 'string')
                    throw new Error("Access token invalid primit la refresh.");

                await secureStore.setItemAsync('accessToken', newAccessToken);
                await secureStore.deleteItemAsync('accesToken');

                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                
                return await fetch(endpointUrl, config);
            }

        } else console.log("Nu a fost gasit acel refresh token!");
    }
    return response;
}
