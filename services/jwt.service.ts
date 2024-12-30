import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key'; // Replace with your secret key

// export default function handler(req, res) {
//     if (req.method === 'POST') {
//         const { payload } = req.body;

//         if (!payload) {
//             return res.status(400).json({ error: 'Payload is required' });
//         }

//         try {
//             // Sign the payload to create the token
//             const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour
//             return res.status(200).json({ token });
//         } catch (error) {
//             return res.status(500).json({ error: 'Error generating token' });
//         }
//     } else {
//         res.setHeader('Allow', ['POST']);
//         return res.status(405).json({ error: `Method ${req.method} not allowed` });
//     }
// }


export const generateSubscriptionString = async (garageId: string, expiryDate: string) => {
    const subscriptionString = jwt.sign({ garageId }, SECRET_KEY, { expiresIn: expiryDate });
    return subscriptionString;
}