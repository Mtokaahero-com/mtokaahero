'use client'

// components/AuthWrapper.tsx
import { useDispatch, useSelector } from 'react-redux';
import { getValidAuthTokens } from '@/lib/cookies';
import { useRouter } from 'next/router';

type Props = {
    children?: React.ReactNode;
};

export default function AuthWrapper({ children }: Props) {
    
}
