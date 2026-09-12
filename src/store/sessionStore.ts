'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Artesao, Customer } from './types';

interface SessionState {
    customer: Customer | null;
    artesao: Artesao | null;

    loginCustomer: (customer: Customer) => void;
    logoutCustomer: () => void;

    loginArtesao: (artesao: Artesao) => void;
    logoutArtesao: () => void;
}

export const useSessionStore = create<SessionState>()(
    persist(
        (set) => ({
            customer: null,
            artesao: null,

            loginCustomer: (customer) => set({ customer }),
                  logoutCustomer: () => set({ customer: null }),

                  loginArtesao: (artesao) => set({ artesao }),
                  logoutArtesao: () => set({ artesao: null }),

                  logoutAll: () => set({ customer: null, artesao: null }),
        }),
        {
            name: 'session-storage',
        }
    )
);
