import { useState, useEffect, useCallback, useMemo } from 'react';

// Simple hash-based router to work in this environment
export const useHashRouter = () => {
    const [hash, setHash] = useState(window.location.hash.slice(1) || '/');
    
    useEffect(() => {
        const handleHashChange = () => setHash(window.location.hash.slice(1) || '/');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = useCallback((to: string) => {
        window.location.hash = to;
    }, []);
    
    const { path, params } = useMemo(() => {
        const pathParts = hash.split('/').filter(p => p);
        const path = `/${pathParts.join('/')}`;
        return { path, params: pathParts };
    }, [hash]);


    return { path, params, navigate };
};