"use client"


import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface User {
    id: number;
    email: string;
    [key: string]: any;
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
    
    useEffect(() => {
        try {
            const token = Cookies.get("token");
            if (token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                axios.get("/auth/me").then((response) => {
                    setUser(response.data);
                });
            }
        } catch (error) {
            console.error(error);
            Cookies.remove("token");
            setUser(null);
        }
    }, []);  


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
            const response = await axios.post("http://localhost:8880/auth/api/validate", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            interface expectedResponse {
                valid: boolean;
            }
            const data = response.data as expectedResponse;
            return data.valid;
        } catch (error) {
            console.error(error);
            Cookies.remove("token");
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