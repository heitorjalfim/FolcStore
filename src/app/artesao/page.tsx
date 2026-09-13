'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';

export default function Artesao() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Best Practice: Always use selectors to extract Zustand state to prevent unnecessary re-renders.
    const logoutArtesao = sessionStore((state) => state.logoutArtesao);
    const isArtesaoLogged = sessionStore((state) => state.isArtesaoLogged);
    const artesao = sessionStore((state) => state.artesao);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && !isArtesaoLogged()) {
            router.push('/artesao/login');
        }
    }, [mounted, isArtesaoLogged]);

    if (!mounted || !isArtesaoLogged()) return null;

    const handleLogout = () => {
        logoutArtesao();
        router.push('/');
    };

    return (
        <div>
            <h1>Dashboard Artesão</h1>
            <p>Bem-vindo, {artesao?.nome}</p>

            <button onClick={handleLogout}>Sair (Logout)</button>
        </div>
    );
}
