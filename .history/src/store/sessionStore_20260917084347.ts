'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Artesao, Customer, Admin } from '@/types';

interface SessionState {
    customer: Customer | null;
    artesao: Artesao | null;
    admin: Admin | null;

    isCustomerLogged: () => boolean;
    salvarCustomer: (customer: Customer) => void;
    logoutCustomer: () => void;

    isArtesaoLogged: () => boolean;
    salvarArtesao: (artesao: Artesao) => void;
    logoutArtesao: () => void;

    isAdminLogged: () => boolean;
    salvarAdmin: (admin: Admin) => void;
    logoutAdmin: () => void;

    logoutAll: () => void;
}

export const sessionStore = create<SessionState>()(
    persist(
        (set, get) => ({
            customer: null,
            artesao: null,
            admin: null,

            isCustomerLogged: () => get().customer !== null,
            salvarCustomer: (customer) => set({ customer }),
            logoutCustomer: () => set({ customer: null }),

            isArtesaoLogged: () => get().artesao !== null,
            salvarArtesao: (artesao) => set({ artesao }),
            logoutArtesao: () => set({ artesao: null }),

            isAdminLogged: () => get().admin !== null,
            salvarAdmin: (admin) => set({ admin }),
            logoutAdmin: () => set({ artesao: null }),

            logoutAll: () => set({ customer: null, artesao: null, admin: null }),
        }),
        {
            name: 'session-storage',
        }
    )
);