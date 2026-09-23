import { apiService } from './apiService';
import { Order } from '@/types/order';

export const orderService = {
    async getTodasCompras(): Promise<Order[]> {
        try {
            const response = await apiService.get<Order[]>('/orders');
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar todas as compras:", error);
            throw error;
        }
    },

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
    },

    async getComprasPorComprador(idComprador: string): Promise<Order[]> {
        try {
            const response = await apiService.get<Order[]>('/orders', {
                params: { 
                    idComprador: idComprador,
                    _t: new Date().getTime() 
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar compras do cliente:", error);
            throw error;
        }
    },

    async declararRecebimento(idPedido: string): Promise<Order> {
        try {
            const response = await apiService.patch<Order>(`/orders/${idPedido}`, {
                situacaoEntrega: "Entregue"
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao declarar recebimento:", error);
            throw error;
        }
    },

    async marcarComoAvaliado(idPedido: string): Promise<Order> {
        try {
            const response = await apiService.patch<Order>(`/orders/${idPedido}`, {
                avaliado: true
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao marcar pedido como avaliado:", error);
            throw error;
        }
    }
    
};
