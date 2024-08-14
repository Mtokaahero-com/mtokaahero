"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  defaultLoginObject,
  defaultValidateObject,
  customerObject,
} from "../interfaces/api-interfaces";
import Router from "next/router";

interface User {
  id: number;
  email: string;
  role: string;
  [key: string]: any;
}

interface returnValidateObject {
  isSuccessful: boolean;
  message: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  validateToken: (
    token: string,
    tokenContext: string,
  ) => Promise<returnValidateObject | undefined>;
  register: (
    firstName: string,
    lastName: string,
    phone: string,
    address: string,
    email: string,
    password: string,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [setToken] = useState<string | null>(
    Cookies.get("ntokaaCustomer") || null,
  );
  const router = Router;

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5500/api/auth/login",
        { email, password },
      );
      Cookies.set("token", response.data.token);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async function validateToken(
    token: string,
    tokenContext: string,
  ): Promise<returnValidateObject | undefined> {
    try {
      const response = await axios.get(
        "http://localhost:5500/api/auth/validate",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data: defaultValidateObject = response.data;
      console.log(data);
      if (data.error) {
        Cookies.remove("ntokaaCustomer");
        setUser(null);
        return { isSuccessful: false, message: data.message };
      } else {
        setUser(data.payload);
        return { isSuccessful: true, message: data.message };
      }
    } catch (error) {
      console.error(error);
      return { isSuccessful: false, message: "An error occured" };
    }
  }

  const register = async (
    firstName: string,
    lastName: string,
    phone: string,
    address: string,
    email: string,
    password: string,
  ) => {
    const response = await fetch("http://localhost:5500/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        address,
        email,
        password,
      }),
    });
    const data: customerObject = await response.json();
    if (data.httpStatus === 201) {
      throw new Error("An error occured");
    } else {
      Cookies.set("mtokaaCustomer", data.access_token);
      setUser(data.customer);
    }
  };

  const logout = () => {
    Cookies.remove("ntokaaCustomer");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, validateToken, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
