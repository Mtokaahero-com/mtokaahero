'use server'

import { getUserByEmail } from "../db/UserCrud";


export const fetchUsers = async (email: string) => {
    return await getUserByEmail(email);
}