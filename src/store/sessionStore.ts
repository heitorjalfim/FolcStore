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
        // 1. Adicione o 'get' aqui
        (set, get) => ({
            customer: null,
            artesao: null,

            // 2. Use get().customer e compare com null (e use vírgula no final)
            isCustomerLogged: () => get().customer !== null,
                       loginCustomer: (customer) => set({ customer }),
                       logoutCustomer: () => set({ customer: null }),

                       // 3. Mesma coisa para o artesão
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
