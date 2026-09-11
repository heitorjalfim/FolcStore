'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '../../store/sessionStore';

export default function OlaRolePage() {
    const { user } = useSessionStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div>
        <h1>Olá, {user.role}</h1>
        <h1>Essa pagina é uma demonstração de como pegar informação do usuario</h1>
        </div>
    );
}
