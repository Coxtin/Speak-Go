import * as secureStore from 'expo-secure-store';
import { BASE_URL } from '../../config/config';

const API_BASE_URL = `${BASE_URL}/api`;

export const apiFetch = async (endpoint: string, options: any = {}) => {

    const accesToken = await secureStore.getItemAsync('accesToken');
    const isFormDataBody = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const endpointUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const requestHeaders = {
        ...options.headers,
        ...(accesToken ? {'Authorization': `Bearer ${accesToken}`} : {}),
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

                const { accesToken: newAccesToken } = await refreshRes.json();

                await secureStore.setItemAsync('accesToken', newAccesToken);

                config.headers['Authorization'] = `Bearer ${newAccesToken}`;
                
                return await fetch(endpointUrl, config);
            }

        } else console.log("Nu a fost gasit acel refresh token!");
    }
    return response;
}
