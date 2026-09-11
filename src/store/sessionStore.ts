'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'visitante' | 'comprador' | 'artesao';

const MOCK_USERS = [
    { id: '1', name: 'Usuário Visitante', role: 'visitante' as Role },
    { id: '2', name: 'Usuário Comprador', role: 'comprador' as Role },
    { id: '3', name: 'Usuário Artesão', role: 'artesao' as Role },
                    ];

interface SessionState {
    user: { id: string; name: string; role: Role };
    login: (id: string) => void;
}

export const useSessionStore = create<SessionState>()(
    persist(
        (set) => ({
            user: MOCK_USERS[0],

        login: (id: string) => set((state) => {
            const foundUser = MOCK_USERS.find((u) => u.id === id);

            if (foundUser) {
                return { user: foundUser };
            }
            return state;
        }),
        }),
        { name: 'session-storage' }
    )
);
