'use client'

// components/AuthWrapper.tsx
import { useDispatch, useSelector } from 'react-redux';
import { getValidAuthTokens } from '@/lib/cookies';
import { useRouter } from 'next/router';
import { useGetAuthDataQuery } from '@/app/store/authApi';
import { useEffect } from 'react';
import LoadingComponent from '@/components/ui/loading';
import { RootState } from '@/app/store';

type Props = {
    children?: React.ReactNode;
};

export default function AuthWrapper({ children }: Props) {
    const dispacth = useDispatch();
    const { push } = useRouter();
    const { userEmail } = useSelector((state: RootState) => state.auth);
    
    const token = getValidAuthTokens();

    const { error, isLoading } = useGetAuthDataQuery({ token: token || '' }, {
        skip: !!userEmail || !token
    })

    useEffect(() => {
        if (!token) {
            push('/auth/login');
            //window.location.href = '/auth/login';
        }
    }, [token, push])

    return (isLoading || error) ? <LoadingComponent /> : children;
}
