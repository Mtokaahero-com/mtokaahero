import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    const token = cookies.get('accessToken');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const response = await axios.get('http://localhost:8880/api/auth/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const user = response.data;
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}