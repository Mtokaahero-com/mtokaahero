import { DefaultSession, NextAuthOptions } from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";


declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
        }
    }
}