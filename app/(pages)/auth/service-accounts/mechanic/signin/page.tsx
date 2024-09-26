'use client';

import React, { useState } from 'react';
import { useLoginMutation } from '@/app/store/servces/authApi';
import { toast } from 'sonner';


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, isError, data }] = useLoginMutation(); // Use the login mutation hook

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = await login({ email, password }).unwrap(); // Make the login request
            if (payload === undefined || payload === null) {
                toast.error('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input"
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input"
                />
            </div>
            <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {isError && <p className="text-red-500">Login failed. Please try again.</p>}
        </form>
    );
};

export default LoginForm;
