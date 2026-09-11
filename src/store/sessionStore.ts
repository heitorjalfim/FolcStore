'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'visitante' | 'comprador' | 'artesao';

// Convert to an array so we can easily find a user by ID
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
            user: MOCK_USERS[0], // Default state (visitante)

        // Single login function that looks up the user by ID
        login: (id: string) => set((state) => {
            const foundUser = MOCK_USERS.find((u) => u.id === id);

            // If the ID matches a mock user, update the state. Otherwise, do nothing.
            if (foundUser) {
                return { user: foundUser };
            }
            return state;
        }),
        }),
        { name: 'session-storage' }
    )
);
