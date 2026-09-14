'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';

export default function AdminPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Best Practice: Always use selectors to extract Zustand state to prevent unnecessary re-renders.
    const logoutAdmin = sessionStore((state) => state.logoutAdmin);
    const isAdminLogged = sessionStore((state) => state.isAdminLogged);
    const admin = sessionStore((state) => state.admin);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && !isAdminLogged()) {
            router.push('/admin/login');
        }
    }, [mounted, isAdminLogged]);

    if (!mounted || !isAdminLogged()) return null;

    const handleLogout = () => {
        logoutAdmin();
        router.push('/');
    };

    return (
        <div>
            <h1>Dashboard Admin</h1>
            <p>Bem-vindo, {admin?.nome}</p>

            <button onClick={handleLogout}>Sair (Logout)</button>
        </div>
    );
}
