'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/sessionStore'; // Adjust path if your store is named differently
import { userService } from '@/services/userService';

export default function ArtesaoLoginPage() {
    // Hydration mismatch fix
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const loginArtesao = useSessionStore((state) => state.loginArtesao);

    // Do not render the form until the client has mounted to prevent SSR errors
    if (!mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const artesao = await userService.loginArtesao(email, senha);

            if (artesao) {
                loginArtesao(artesao);
                router.push('/'); // Redirect to Home or Artesão Dashboard
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
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
        <h2>Login de Artesão</h2>
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '5px' }}>E-mail do Artesão:</label>
        <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '5px' }}>Senha:</label>
        <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        </div>

        <button
        type="submit"
        disabled={isLoading}
        style={{
            padding: '10px',
            marginTop: '10px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
        }}
        >
        {isLoading ? 'Entrando...' : 'Entrar como Artesão'}
        </button>
        </form>
        </div>
    );
}
