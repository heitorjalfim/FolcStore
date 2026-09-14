'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';

export default function CustomerPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Best Practice: Always use selectors to extract Zustand state to prevent unnecessary re-renders.
    const logoutCustomer = sessionStore((state) => state.logoutCustomer);
    const isCustomerLogged = sessionStore((state) => state.isCustomerLogged);
    const customer = sessionStore((state) => state.customer);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && !isCustomerLogged()) {
            router.push('/customer/login');
        }
    }, [mounted, isCustomerLogged]);

    if (!mounted || !isCustomerLogged()) return null;

    const handleLogout = () => {
        logoutCustomer();
        router.push('/');
    };

    return (
        <div>
            <h1>Dashboard customer</h1>
            <p>Bem-vindo, {customer?.nome}</p>

            <button onClick={handleLogout}>Sair (Logout)</button>
        </div>
    );
}
