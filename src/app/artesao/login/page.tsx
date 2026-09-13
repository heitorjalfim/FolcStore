'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';
import { userService } from '@/services/userService';

export default function CustomerLoginPage() {
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const loginArtesao = sessionStore((state) => state.loginArtesao);
    const isArtesaoLogged = sessionStore((state) => state.isArtesaoLogged)

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if(isArtesaoLogged()) {
            router.push('/artesao')
        }
    },[]);

    if (!mounted || isArtesaoLogged()) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const artesao = await userService.loginArtesao(email, senha);

            if (artesao) {
                loginArtesao(artesao);
                router.push('/artesao');
            } else {
                setError('E-mail ou senha inválidos.');
            }
        } catch (err) {
            setError('Ocorreu um erro ao tentar fazer login.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
        <h2>Login de Artesão</h2>
        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
        <div>
        <label>E-mail:</label>
        <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        />
        </div>

        <div>
        <label>Senha:</label>
        <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
        />
        </div>

        <button
        type="submit"
        disabled={isLoading}
        >
        {isLoading ? 'Entrando...' : 'Entrar como Artesão'}
        </button>
        </form>
        </div>
    );
}
