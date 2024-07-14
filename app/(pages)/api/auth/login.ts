import axios from 'axios';
import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        
        try {
            const response = await axios.post('http://localhost:8880/api/auth/login', {
                email,
                password
            });
            const { accessToken, user } = response.data;
            const cookies = new Cookies(req, res);
            cookies.set('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: 'Method not allowed' });
    }
}