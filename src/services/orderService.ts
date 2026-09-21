import { apiService } from './apiService';
import { Order } from '@/types/order';

export const orderService = {
    async registrarCompras(compras: Order[]): Promise<void> {
        try {
            await Promise.all(compras.map(compra =>
                apiService.post('/orders', { ...compra, id: crypto.randomUUID() })
            ));
        } catch (error) {
            console.error("Erro ao registrar compras:", error);
            throw error;
        }
    },

    async getComprasPorArtesao(idArtesao: string): Promise<Order[]> {
        try {
            const response = await apiService.get<Order[]>('/orders', {
                params: {
                    idArtesao: idArtesao,
                    _t: new Date().getTime()
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar compras do artesão:", error);
            throw error;
        }
    },

    async declararPostagem(idPedido: string, codigoPostagem: string): Promise<Order> {
        try {
            const response = await apiService.patch<Order>(`/orders/${idPedido}`, {
                situacaoEntrega: "Enviado",
                codigoPostagem: codigoPostagem
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao declarar postagem:", error);
            throw error;
        }
    }
};
