'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addItem: (newItem) => set((state) => {
                const exists = state.items.find((i) => i.id === newItem.id);
                if (exists) {
                    return { items: state.items.map((i) => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i) };
                }
                return { items: [...state.items, { ...newItem, quantity: 1 }] };
            }),
            removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
                  clearCart: () => set({ items: [] }),
        }),
        { name: 'cart-storage' }
    )
);
