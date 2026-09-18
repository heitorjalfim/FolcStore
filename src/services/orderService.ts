import { apiService } from './apiService';
import { Order } from '@/types';

export const orderService = {
    async create(order: Omit<Order, 'id'>): Promise<Order> {
        try {
            const payload: Order = { ...order, id: crypto.randomUUID() };
            const response = await apiService.post<Order>('/orders', payload);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            throw error;
        }
    },
};
