import React, {createContext, useState, useEffect, ReactNode} from "react";
import * as secureStore from 'expo-secure-store';

type UserData = {
    id: string,
    email: string,
    username: string,
}

type AuthContextType = {
    user: UserData | null;
    isLoading: boolean;
    login: (token: string, refreshToken:string, userData: UserData) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : {children: ReactNode}) => {

    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const checkToken = async () => {

            try{

                const storedAccessToken = await secureStore.getItemAsync('accessToken');
                const storedRefreshToken = await secureStore.getItemAsync('refreshToken');
                const storedUser = await secureStore.getItemAsync('userData');

                if (storedAccessToken && storedRefreshToken && storedUser){

                    setUser(JSON.parse(storedUser));

                }

            } catch (error: any){

                console.error("Error at checking stored token!");

            } finally {
                setIsLoading(false);
            }

        }

        checkToken();

    }, [])

    const login = async (token: string, refreshToken: string, userData: UserData) => {

        await secureStore.setItemAsync('accessToken', token);
        await secureStore.setItemAsync('refreshToken', refreshToken);
        await secureStore.setItemAsync('userData', JSON.stringify(userData));
        setUser(userData);

    }

    const logout = async () => {

        await secureStore.deleteItemAsync('accessToken');
        await secureStore.deleteItemAsync('refreshToken');
        await secureStore.deleteItemAsync('userData');
        setUser(null);

    }

    return (
        <AuthContext.Provider value={{user, isLoading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}

    
