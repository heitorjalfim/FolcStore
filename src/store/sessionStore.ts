'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Artesao, Customer } from './types';

interface SessionState {
    customer: Customer | null;
    artesao: Artesao | null;

    isCustomerLogged: () => boolean;
    loginCustomer: (customer: Customer) => void;
    logoutCustomer: () => void;

    isArtesaoLogged: () => boolean;
    loginArtesao: (artesao: Artesao) => void;
    logoutArtesao: () => void;

    logoutAll: () => void;
}

export const sessionStore = create<SessionState>()(
    persist(
        (set, get) => ({
            customer: null,
            artesao: null,

            isCustomerLogged: () => get().customer !== null,
            loginCustomer: (customer) => set({ customer }),
            logoutCustomer: () => set({ customer: null }),

            isArtesaoLogged: () => get().artesao !== null,
            loginArtesao: (artesao) => set({ artesao }),
            logoutArtesao: () => set({ artesao: null }),

            logoutAll: () => set({ customer: null, artesao: null }),
        }),
        {
            name: 'session-storage',
        }
    )
);
