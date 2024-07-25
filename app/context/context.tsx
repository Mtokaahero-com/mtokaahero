"use client"


import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface User {
    id: number;
    email: string;
    [key: string]: any;
}


interface AuthProps {
    statusCode: number;
    message: string;
    error: string | null;
}

interface AuthContextProps{
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    validateToken: (token: string) => Promise<boolean | undefined>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post("/api/auth/login", { email, password });
            Cookies.set("token", response.data.token);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function validateToken(token: string) {
        try {
            const response = await axios.get("http://localhost:8880/api/auth/validate", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log(response.data);
            const data = response.data as AuthProps;
            if (data.statusCode === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            // Cookies.remove("token");
            setUser(null);
        }
    }

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, validateToken }}>
            {children}
        </AuthContext.Provider>
    );
} 


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}