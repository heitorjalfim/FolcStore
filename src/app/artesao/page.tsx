"use client";

import AvaliacaoCard from "../components/AvaliacaoCard";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';

// TODO: substituir esse mock pela lista de avaliações reais desse artesão,
// buscada do backend, quando a API estiver pronta.
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

    const avaliacoes = [
        { nota: 5, comentario: "Peça linda, chegou rápido!", data: "10/09/2026" },
        { nota: 4, comentario: "Muito bonita, só demorou um pouco.", data: "05/09/2026" },
        { nota: 5, comentario: "Superou minhas expectativas.", data: "01/09/2026" },
    ];

    let conteudo;
    if (avaliacoes.length === 0) {
        conteudo = <p>Ainda não há avaliações para esse vendedor.</p>;
    } else {
        const soma = avaliacoes.reduce((total, avaliacao) => total + avaliacao.nota, 0);
        const media = soma / avaliacoes.length;

        conteudo = (
            <div>
                <p>Nota média: {media.toFixed(1)} / 5</p>
                {avaliacoes.map((avaliacao, index) => (
                    <AvaliacaoCard key={index} avaliacao={avaliacao} />
                ))}
            </div>
        );
    }

    return (
        <div>
            <h1>Avaliações do artesão</h1>
            {conteudo}
        </div>
    );
}
