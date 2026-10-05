'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ApiState<T> {
    data: T | undefined;
    error: Error | undefined;
    loading: boolean;
    reload: () => void;
}

/** Fetches on mount and whenever `key` changes; stale responses from an earlier key are ignored. */
export function useApi<T>(key: string | null, fetcher: () => Promise<T>): ApiState<T> {
    const [data, setData] = useState<T>();
    const [error, setError] = useState<Error>();
    const [loading, setLoading] = useState(key !== null);
    const [nonce, setNonce] = useState(0);
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    useEffect(() => {
        if (key === null) return;
        let active = true;
        setLoading(true);
        setError(undefined);
        fetcherRef
            .current()
            .then((result) => active && setData(result))
            .catch((err: unknown) => active && setError(err instanceof Error ? err : new Error(String(err))))
            .finally(() => active && setLoading(false));
        return () => {
            active = false;
        };
    }, [key, nonce]);

    const reload = useCallback(() => setNonce((n) => n + 1), []);
    return { data, error, loading, reload };
}
